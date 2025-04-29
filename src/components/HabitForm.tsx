
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Category, Habit, HabitWithStats } from "@/types";
import { createHabit } from "@/utils/habitUtils";
import { saveHabit } from "@/utils/storageUtils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
  category: z.enum(["health", "work", "learning", "social", "creativity", "mindfulness", "finance"]),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});

interface HabitFormProps {
  habit?: Habit | HabitWithStats | null;
  onClose: () => void;
}

const HabitForm = ({ habit, onClose }: HabitFormProps) => {
  const { toast } = useToast();
  const isEditing = !!habit;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      category: habit?.category || "health",
      frequency: habit?.frequency || "daily",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && habit) {
        const updatedHabit = {
          ...habit,
          name: values.name,
          description: values.description,
          category: values.category as Category,
          frequency: values.frequency,
          updatedAt: new Date().toISOString(),
        };
        saveHabit(updatedHabit);
        toast({
          title: "Habit updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        const newHabit = createHabit(
          values.name,
          values.description || "",
          values.category as Category,
          values.frequency
        );
        saveHabit(newHabit);
        toast({
          title: "Habit created",
          description: `${values.name} has been added to your habits.`,
        });
      }
      // Make sure to close dialog and trigger refresh
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your habit.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Habit" : "Create New Habit"}</h2>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Exercise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="30 minutes of exercise daily" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="work">Work & Productivity</SelectItem>
                    <SelectItem value="learning">Education & Skills</SelectItem>
                    <SelectItem value="social">Social & Relationships</SelectItem>
                    <SelectItem value="creativity">Creative & Hobbies</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness & Wellbeing</SelectItem>
                    <SelectItem value="finance">Finance & Resources</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Habit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HabitForm;
