package com.glucode.taskmanager.service;

import com.glucode.taskmanager.entity.Task;
import com.glucode.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task createTask(Task task) {
        task.setCompleted(false);
        return repository.save(task);
    }

    public Task completeTask(Long id) {
        Task task = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Task not found"
            ));

        task.setCompleted(true);
        return repository.save(task);
    }

    public void deleteTask(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Task not found"
            );
        }
        repository.deleteById(id);
    }
}