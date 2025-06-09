import React from "react";

// Components (Pure Tailwind replacements)
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-2xl border bg-white p-4 shadow">{children}</div>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={"" + className}>{children}</div>
);

export const Tabs: React.FC<{
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={"" + className}>{children}</div>
);

export const TabsList: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-2 flex gap-2">{children}</div>;

export const TabsTrigger: React.FC<{
  children: React.ReactNode;
  value: string;
}> = ({ children }) => (
  <button className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
    {children}
  </button>
);

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
}> = ({ children, className = "", variant = "default", size = "md" }) => {
  const base = "rounded-xl px-3 py-1 text-sm font-medium transition";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`}>
      {children}
    </button>
  );
};

export const Textarea: React.FC<{
  placeholder?: string;
  className?: string;
}> = ({ placeholder = "", className = "" }) => (
  <textarea
    placeholder={placeholder}
    className={`w-full rounded-xl border p-2 text-sm ${className}`}
  ></textarea>
);

export const Checkbox: React.FC<{
  checked?: boolean;
  onChange?: () => void;
}> = ({ checked = false, onChange }) => (
  <input
    type="checkbox"
    className="h-4 w-4"
    checked={checked}
    onChange={onChange}
  />
);

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: string;
}> = ({ children, variant = "default" }) => {
  const variants: Record<string, string> = {
    default: "bg-gray-200 text-gray-700",
    secondary: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant] || ""}`}
    >
      {children}
    </span>
  );
};

export const Separator = () => (
  <div className="my-2 border-t border-gray-200"></div>
);

// Main component
const TaskDetail = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      {/* Left Section */}
      <div className="flex-1 space-y-4">
        <div className="text-sm text-gray-500">/ SIMSV2-4182</div>
        <h1 className="text-2xl font-semibold">
          Rate Limit Issue in the Backend
        </h1>
        <Button className="mt-2">+ Add</Button>

        <div className="mt-4">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="mt-1 text-sm text-gray-700">
            Rate Limit Issue in the Backend
          </p>
          <p className="mt-1 text-sm text-gray-500">Environment: None</p>
        </div>

        <Tabs defaultValue="comments" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="worklog">Work log</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="flex items-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold text-white">
              RP
            </div>
            <Textarea placeholder="Add a comment..." className="resize-none" />
          </CardContent>
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {[
              "🎉 Looks good!",
              "👋 Need help?",
              "⛔ This is blocked...",
              "🔍 Can you clarify...?",
              "✅ This is on track",
            ].map((text, i) => (
              <Button key={i} variant="outline" size="sm">
                {text}
              </Button>
            ))}
          </div>
        </Card>
        <p className="text-muted-foreground pl-2 pt-1 text-xs">
          Pro tip: press <kbd className="border px-1">M</kbd> to comment
        </p>
      </div>

      {/* Right Sidebar */}
      <div className="w-full space-y-4 md:w-80">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">To Do</div>
          <span className="text-gray-500">⚡</span>
        </div>

        <Card>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Assignee:</span> Rahul Prasad
            </div>
            <div>
              <span className="font-semibold">Reporter:</span> Rahul Prasad
            </div>
            <div className="cursor-pointer text-blue-600">
              Open with Atlassian...
            </div>
            <div className="cursor-pointer text-blue-600">Create branch</div>
            <div className="cursor-pointer text-blue-600">Create commit</div>
            <Separator />
            <div>
              <span className="font-semibold">Labels:</span> None
            </div>
            <div>
              <span className="font-semibold">Sprint:</span> SIMSV2 Sprint 53{" "}
              <Badge>+1</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Priority:</span>
              <Badge variant="secondary">Medium</Badge>
            </div>
            <Separator />
            <div className="text-gray-500">Created May 19, 2025 at 1:53 PM</div>
            <div className="text-gray-500">Updated May 28, 2025 at 2:50 PM</div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>👁️</span>
            <span>👍</span>
            <span>🔍</span>
          </div>
          <span className="cursor-pointer">❌</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
