import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  useGetAssistantName,
  useGetMessages,
  useSendMessage,
  useUpdateAssistantName,
} from "@/hooks/useQueries";
import { Bot, Loader2, Send, Settings, User, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="msg-bubble-assistant rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading: messagesLoading } = useGetMessages();
  const { data: assistantName = "Z Assistant" } = useGetAssistantName();
  const sendMessage = useSendMessage();
  const updateName = useUpdateAssistantName();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessage.isPending) return;
    setInputValue("");
    try {
      await sendMessage.mutateAsync(trimmed);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRenameOpen = () => {
    setRenameValue(assistantName);
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    try {
      await updateName.mutateAsync(trimmed);
      setRenameOpen(false);
      toast.success(`Assistant renamed to "${trimmed}"`);
    } catch {
      toast.error("Failed to rename assistant");
    }
  };

  const suggestions = [
    "What can you do?",
    "Tell me a fun fact",
    "Help me write code",
  ];

  return (
    <div className="h-full flex flex-col bg-background grid-texture">
      <Toaster />

      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center glow-cyan">
              <span className="font-mono font-bold text-primary text-lg leading-none">
                Z
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          </div>
          <div>
            <h1 className="font-mono font-semibold text-foreground text-sm tracking-wide">
              {assistantName}
            </h1>
            <p className="text-xs text-muted-foreground">
              AI Assistant · Online
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRenameOpen}
          data-ocid="settings.open_modal_button"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
          title="Rename assistant"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full scrollbar-dark">
          <div className="px-4 py-6 max-w-3xl mx-auto">
            {messagesLoading ? (
              <div data-ocid="chat.loading_state" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
                  >
                    <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
                    <Skeleton
                      className={`h-10 rounded-2xl ${
                        i % 2 === 0 ? "w-40" : "w-64"
                      }`}
                    />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <motion.div
                data-ocid="chat.empty_state"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-20 gap-5"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl glow-cyan opacity-60" />
                </div>
                <div className="text-center space-y-1.5">
                  <p className="font-mono font-semibold text-foreground text-lg">
                    {assistantName}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Start a conversation. Ask me anything — I'm here to help.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setInputValue(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                  const msgKey = `${msg.sender}-${idx}-${msg.content.slice(0, 12)}`;
                  return (
                    <motion.div
                      key={msgKey}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-end gap-2.5 mb-4 ${
                        msg.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "user"
                            ? "bg-secondary border border-border"
                            : "bg-primary/20 border border-primary/40"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "msg-bubble-user rounded-br-sm text-foreground"
                            : "msg-bubble-assistant rounded-bl-sm text-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                })}

                {sendMessage.isPending && <TypingIndicator key="typing" />}
              </AnimatePresence>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input bar */}
      <footer className="flex-shrink-0 border-t border-border bg-background/90 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              data-ocid="chat.input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${assistantName}...`}
              disabled={sendMessage.isPending}
              className="bg-muted/40 border-border focus:border-primary/60 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground rounded-xl pr-4 py-2.5 text-sm h-auto"
            />
          </div>
          <Button
            data-ocid="chat.submit_button"
            onClick={handleSend}
            disabled={!inputValue.trim() || sendMessage.isPending}
            size="icon"
            className="rounded-xl w-10 h-10 bg-primary hover:bg-primary/80 text-primary-foreground flex-shrink-0 shadow-glow transition-all"
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground/50 mt-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent
          data-ocid="settings.dialog"
          className="bg-card border-border text-foreground sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="font-mono text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Rename Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label className="text-sm text-muted-foreground">
              Assistant name
            </Label>
            <Input
              data-ocid="settings.input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSave();
              }}
              placeholder="Enter a name..."
              className="bg-muted/40 border-border focus:border-primary/60 text-foreground"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              data-ocid="settings.cancel_button"
              variant="ghost"
              onClick={() => setRenameOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              data-ocid="settings.save_button"
              onClick={handleRenameSave}
              disabled={!renameValue.trim() || updateName.isPending}
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              {updateName.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
