import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTaskStore } from "@/lib/store";
import { Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  backgroundImage: string;
  dueDate: string;
  type: "daily" | "weekly" | "none";
}

const CreateTaskDialog = ({ open, onOpenChange }: CreateTaskDialogProps) => {
  const { register, handleSubmit, reset, setValue, control } =
    useForm<FormData>({
      defaultValues: {
        type: "none",
        title: "",
        description: "",
        backgroundImage: "",
        dueDate: "",
      },
    });
  const addTask = useTaskStore((state) => state.addTask);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

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

  const onSubmit = (data: FormData) => {
    addTask({
      title: data.title,
      description: data.description,
      backgroundImage: data.backgroundImage || previewImage,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      type: data.type,
    });
    reset();
    setPreviewImage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              {...register("title", { required: true })}
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter task description"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="create-none" />
                    <Label htmlFor="create-none">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="create-daily" />
                    <Label htmlFor="create-daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="create-weekly" />
                    <Label htmlFor="create-weekly">Weekly</Label>
                  </div>
                </RadioGroup>
              )}
            />
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
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
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
          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
