package com.aqiapp.kathmanduaqi.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final SymptomLogRepository symptomLogRepository;

    public AdminController(UserRepository userRepository, SymptomLogRepository symptomLogRepository) {
        this.userRepository = userRepository;
        this.symptomLogRepository = symptomLogRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/symptoms")
    public ResponseEntity<List<SymptomLog>> getAllSymptoms() {
        return ResponseEntity.ok(symptomLogRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }
}