package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.Role;
import com.nextune.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched", adminService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User found", adminService.getUserById(id)));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleStatus(
            @PathVariable Long id, @RequestParam boolean active) {
        return ResponseEntity.ok(
            ApiResponse.success("User status updated", adminService.toggleUserStatus(id, active)));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(
            ApiResponse.success("User role updated", adminService.updateUserRole(id, role)));
    }

    @GetMapping("/songs/pending")
    public ResponseEntity<ApiResponse<List<SongResponse>>> getPendingSongs() {
        return ResponseEntity.ok(ApiResponse.success("Pending songs", adminService.getPendingSongs()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Platform stats", adminService.getStats()));
    }
}