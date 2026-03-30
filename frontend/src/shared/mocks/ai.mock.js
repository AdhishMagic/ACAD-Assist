export const mockSavedAiNotes = [
  {
    id: "1",
    title: "Photosynthesis Overview",
    topic: "Biology",
    dateSaved: "2026-03-14T10:00:00Z",
    preview:
      "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy...",
  },
  {
    id: "2",
    title: "Newton's Laws of Motion",
    topic: "Physics",
    dateSaved: "2026-03-15T09:30:00Z",
    preview:
      "First law: An object at rest remains at rest, and an object in motion remains in motion at constant speed...",
  },
];

export const mockGeneratedAiNote = {
  id: "1",
  title: "Advanced Data Structures",
  topic: "Computer Science",
  summary: "A comprehensive overview of trees, graphs, and hash tables.",
  definitions: [
    { term: "Binary Tree", definition: "A tree data structure in which each node has at most two children." },
    { term: "Graph", definition: "A non-linear data structure consisting of nodes and edges." },
  ],
  explanations:
    "Data structures provide a means to manage large amounts of data efficiently for uses such as large databases and internet indexing services.",
  examples: ["AVL Tree", "Red-Black Tree", "Directed Acyclic Graph"],
  practiceQuestions: [
    "How do you balance a binary search tree?",
    "What is the time complexity of searching in a hash table?",
  ],
  citations: [{ id: 1, title: "Introduction to Algorithms", author: "Cormen et al.", link: "#" }],
};

export const mockGeneratedLibrary = [
  { id: "gen-1", title: "Operating Systems - Process Scheduling", createdAt: "Today" },
  { id: "gen-2", title: "Computer Networks - Network Layers", createdAt: "Yesterday" },
  { id: "gen-3", title: "DBMS - Normalization Summary", createdAt: "2 days ago" },
];
