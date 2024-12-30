import React, { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Star,
  CheckCircle,
  Trash2,
  Edit,
  Calendar,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TaskCardProps {
  taskId: string;
}

interface EditFormData {
  title: string;
  description: string;
  backgroundImage: string;
  dueDate: string;
  type: "daily" | "weekly" | "none";
}

const TaskCard = ({ taskId }: TaskCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const task = useTaskStore((state) =>
    state.tasks.find((t) => t.id === taskId),
  );
  const { toggleImportant, toggleTask, deleteTask, updateTask } =
    useTaskStore();

  const { register, handleSubmit, setValue, watch } = useForm<EditFormData>({
    defaultValues: {
      title: task?.title,
      description: task?.description,
      backgroundImage: task?.backgroundImage,
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      type: task?.type || "none",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue("backgroundImage", result);
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!task) return null;

  const onSubmit = (data: EditFormData) => {
    updateTask(task.id, {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      backgroundImage: data.backgroundImage || previewImage,
    });
    setIsEditing(false);
    setPreviewImage("");
  };

  const currentImage =
    watch("backgroundImage") || previewImage || task.backgroundImage;

  return (
    <>
      <Card
        className="group relative bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {task.backgroundImage && (
          <div
            className="h-32 w-full bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${task.backgroundImage})` }}
          />
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`font-semibold text-lg ${task.completed ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                {task.type !== "none" && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                    {task.type}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleTask(task.id)}
              >
                <CheckCircle
                  className={`h-4 w-4 ${task.completed ? "fill-green-500 text-green-500" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleImportant(task.id)}
              >
                <Star
                  className={`h-4 w-4 ${task.important ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{task.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {task.backgroundImage && (
              <div
                className="h-48 w-full bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${task.backgroundImage})` }}
              />
            )}
            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>
            {task.dueDate && (
              <div className="space-y-2">
                <h4 className="font-medium">Due Date</h4>
                <p className="text-muted-foreground">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {task.type !== "none" && (
              <div className="space-y-2">
                <h4 className="font-medium">Task Type</h4>
                <p className="text-muted-foreground capitalize">{task.type}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toggleTask(task.id)}
                className={task.completed ? "bg-green-50" : ""}
              >
                <CheckCircle
                  className={`h-4 w-4 mr-2 ${task.completed ? "text-green-500" : ""}`}
                />
                {task.completed ? "Completed" : "Mark as Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleImportant(task.id)}
                className={task.important ? "bg-yellow-50" : ""}
              >
                <Star
                  className={`h-4 w-4 mr-2 ${task.important ? "text-yellow-400" : ""}`}
                />
                {task.important ? "Important" : "Mark as Important"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...register("title", { required: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea {...register("description")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Image</label>
                <div className="flex flex-col gap-2">
                  <Input
                    {...register("backgroundImage")}
                    placeholder="Enter image URL"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                  {currentImage && (
                    <div className="mt-2">
                      <img
                        src={currentImage}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" {...register("dueDate")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Type</label>
                <RadioGroup
                  defaultValue={task.type}
                  className="flex gap-4"
                  {...register("type")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
