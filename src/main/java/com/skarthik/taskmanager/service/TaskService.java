package com.skarthik.taskmanager.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.skarthik.taskmanager.model.Priority;
import com.skarthik.taskmanager.model.Status;
import com.skarthik.taskmanager.model.Task;
import com.skarthik.taskmanager.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // CREATE TASK
    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    // GET ALL TASKS WITH PAGINATION
    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    // GET TASK BY ID
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    // GET TASKS BY STATUS
    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

    // GET TASKS BY PRIORITY
    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    // SEARCH TASKS BY TITLE
    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // UPDATE TASK
    public Task updateTask(Long id, Task updatedTask) {

        Task existing = getTaskById(id);

        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setStatus(updatedTask.getStatus());
        existing.setPriority(updatedTask.getPriority());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(existing);
    }

    // DELETE TASK
    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}