export default function AiAssistantPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4">AI Study Assistant</h1>
      <div className="flex-1 border rounded-lg bg-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">{/* ChatWindow / MessageBubble components */}</div>
        <div className="border-t p-4">{/* PromptInput component */}</div>
      </div>
    </div>
  );
}
