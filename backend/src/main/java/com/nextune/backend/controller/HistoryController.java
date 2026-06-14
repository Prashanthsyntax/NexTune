package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.repository.UserRepository;
import com.nextune.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;
    private final UserRepository userRepository;

    @PostMapping("/{songId}")
    public ResponseEntity<ApiResponse<Void>> recordHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long songId) {
        historyService.recordHistory(getUserId(userDetails), songId);
        return ResponseEntity.ok(ApiResponse.success("History recorded", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoryResponse>>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(
            ApiResponse.success("Listening history",
                historyService.getHistory(getUserId(userDetails), limit)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        historyService.clearHistory(getUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.success("History cleared", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}