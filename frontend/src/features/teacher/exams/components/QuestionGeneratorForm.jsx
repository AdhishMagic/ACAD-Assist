import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, BookType, Sparkles, LibraryBig, FileText } from 'lucide-react';
import { examAPI } from '../services/examAPI';

export const QuestionGeneratorForm = ({ onGenerate, isGenerating, templateSummary, templates = [] }) => {
  const [config, setConfig] = useState({
    prompt: '',
    difficulty: 'Medium',
    questionCount: 10,
    templateId: '',
    selectedTemplate: null,
    subjectId: '',
    subjectName: '',
    lessonRange: {
      startUnit: '',
      endUnit: '',
      selectedUnits: [],
    },
    useMaterials: true,
    useTemplate: true
  });
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGenerate) onGenerate(config);
  };

  useEffect(() => {
    let isMounted = true;

    const loadSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const result = await examAPI.getSubjects();
        if (isMounted) {
          setSubjects(result);
        }
      } catch (error) {
        console.error('Failed to load subjects', error);
        if (isMounted) {
          setSubjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubjects(false);
        }
      }
    };

    loadSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!config.subjectId) {
      setUnits([]);
      setConfig((prev) => ({
        ...prev,
        lessonRange: {
          startUnit: '',
          endUnit: '',
          selectedUnits: [],
        },
      }));
      return () => {
        isMounted = false;
      };
    }

    const loadUnits = async () => {
      setIsLoadingUnits(true);
      try {
        const result = await examAPI.getUnitsForSubject(config.subjectId);
        if (isMounted) {
          setUnits(result);
        }
      } catch (error) {
        console.error('Failed to load subject units', error);
        if (isMounted) {
          setUnits([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUnits(false);
        }
      }
    };

    loadUnits();

    return () => {
      isMounted = false;
    };
  }, [config.subjectId]);

  useEffect(() => {
    if (!config.templateId && templates.length > 0) {
      const selectedTemplate = templates[0];
      setConfig((prev) => ({
        ...prev,
        templateId: selectedTemplate.id,
        selectedTemplate,
      }));
    }
  }, [config.templateId, templates]);

  const unitOptions = useMemo(() => units.filter((item) => item?.id), [units]);

  const endUnitOptions = useMemo(() => {
    if (!config.lessonRange.startUnit) return unitOptions;
    const startIndex = unitOptions.findIndex((item) => item.id === config.lessonRange.startUnit);
    return startIndex >= 0 ? unitOptions.slice(startIndex) : unitOptions;
  }, [config.lessonRange.startUnit, unitOptions]);

  const handleSubjectChange = (subjectId) => {
    const selectedSubject = subjects.find((subject) => subject.id === subjectId);
    setConfig((prev) => ({
      ...prev,
      subjectId,
      subjectName: selectedSubject?.name || '',
      lessonRange: {
        startUnit: '',
        endUnit: '',
        selectedUnits: [],
      },
    }));
  };

  const handleStartUnitChange = (startUnit) => {
    const startIndex = unitOptions.findIndex((item) => item.id === startUnit);
    const currentEndIndex = unitOptions.findIndex((item) => item.id === config.lessonRange.endUnit);
    setConfig((prev) => ({
      ...prev,
      lessonRange: {
        startUnit,
        endUnit:
          currentEndIndex >= startIndex
            ? prev.lessonRange.endUnit
            : '',
        selectedUnits: [],
      },
    }));
  };

  const handleEndUnitChange = (endUnit) => {
    const startIndex = unitOptions.findIndex((item) => item.id === config.lessonRange.startUnit);
    const endIndex = unitOptions.findIndex((item) => item.id === endUnit);
    const selectedUnits =
      startIndex >= 0 && endIndex >= startIndex
        ? unitOptions.slice(startIndex, endIndex + 1).map((item) => item.label)
        : [];

    setConfig((prev) => ({
      ...prev,
      lessonRange: {
        ...prev.lessonRange,
        endUnit,
        selectedUnits,
      },
    }));
  };

  const requiresRangeSelection = unitOptions.length > 0;
  const isRangeSelectionValid = !requiresRangeSelection || Boolean(config.lessonRange.startUnit && config.lessonRange.endUnit);
  const hasTemplateSelection = Boolean(config.templateId) || templates.length === 0;
  const isSubjectSelectionValid = Boolean(config.subjectId) && isRangeSelectionValid && hasTemplateSelection;

  const handleTemplateChange = (templateId) => {
    const selectedTemplate = templates.find((template) => template.id === templateId) || null;
    setConfig((prev) => ({
      ...prev,
      templateId,
      selectedTemplate,
    }));
  };

  return (
    <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <CardHeader className="border-b space-y-1 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Generation Settings</CardTitle>
            {templateSummary ? (
              <p className="text-xs font-normal text-muted-foreground mt-1">{templateSummary}</p>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-11">Configure the AI engine before generating your exam paper.</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Additional Prompt (Optional)
            </label>
            <textarea 
              className="w-full min-h-[100px] rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              placeholder="E.g., Focus specifically on the Krebs Cycle and cellular respiration. Include one practical application question."
              value={config.prompt}
              onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <BookType className="w-4 h-4 text-blue-500" />
                Overall Difficulty
              </label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={config.difficulty === level ? 'default' : 'outline'}
                    className={`flex-1 ${config.difficulty === level ? 'shadow-md shadow-primary/20' : ''}`}
                    onClick={() => setConfig({ ...config, difficulty: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <LibraryBig className="w-4 h-4 text-orange-500" />
                Subject
              </label>
              <Select value={config.subjectId} onValueChange={handleSubjectChange}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={isLoadingSubjects ? 'Loading subjects...' : 'Select subject'} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code ? `${subject.code} - ${subject.name}` : subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              JSON Template
            </label>
            <Select value={config.templateId} onValueChange={handleTemplateChange}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder={templates.length ? 'Select saved template from DB' : 'No saved templates yet'} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title} {template.sectionCount ? `(${template.sectionCount} sections)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Step 2 uses the template saved in the database, then Step 3 generates the PDF draft from that template.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold">From Unit / Lesson</label>
              <Select
                value={config.lessonRange.startUnit}
                onValueChange={handleStartUnitChange}
                disabled={!config.subjectId || isLoadingUnits || unitOptions.length === 0}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue
                    placeholder={
                      !config.subjectId
                        ? 'Select subject first'
                        : isLoadingUnits
                          ? 'Loading units...'
                          : unitOptions.length === 0
                            ? 'No units found in DB'
                            : 'Select start unit'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold">To Unit / Lesson</label>
              <Select
                value={config.lessonRange.endUnit}
                onValueChange={handleEndUnitChange}
                disabled={!config.lessonRange.startUnit || isLoadingUnits || endUnitOptions.length === 0}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue
                    placeholder={
                      !config.lessonRange.startUnit
                        ? 'Select start unit first'
                        : 'Select end unit'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {endUnitOptions.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border">
            <h4 className="text-sm font-semibold mb-2">Data Sources</h4>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={config.useMaterials}
                  onChange={(e) => setConfig({ ...config, useMaterials: e.target.checked })}
                />
                <div className="h-5 w-5 rounded border border-primary bg-background peer-checked:bg-primary transition-colors"></div>
                <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Uploaded Materials</span>
                <p className="text-xs text-muted-foreground">Extract knowledge directly from your uploaded PDFs and notes.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={config.useTemplate}
                  onChange={(e) => setConfig({ ...config, useTemplate: e.target.checked })}
                />
                <div className="h-5 w-5 rounded border border-primary bg-background peer-checked:bg-primary transition-colors"></div>
                <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Exam Template</span>
                <p className="text-xs text-muted-foreground">Follow the structure and marking scheme defined in the template builder.</p>
              </div>
            </label>
          </div>

          {config.lessonRange.selectedUnits.length > 0 ? (
            <div className="rounded-xl border bg-background/40 p-4">
              <p className="text-sm font-semibold">Selected Range</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {config.lessonRange.selectedUnits.join(' -> ')}
              </p>
            </div>
          ) : null}

          {config.subjectId && unitOptions.length === 0 && !isLoadingUnits ? (
            <div className="rounded-xl border border-dashed bg-background/40 p-4">
              <p className="text-sm font-semibold">No Units Configured Yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This subject exists in the database, but no lesson/unit records are configured yet. You can still save a draft now and refine unit data later.
              </p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="p-6 pt-0 bg-transparent border-t mt-6 flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Estimated generation time: ~30s
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="gap-2 relative overflow-hidden group w-full md:w-auto"
            disabled={isGenerating || !isSubjectSelectionValid}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin mr-2"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                Generate Exam Paper
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionGeneratorForm;
