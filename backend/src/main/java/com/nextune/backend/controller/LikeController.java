package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.repository.UserRepository;
import com.nextune.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final UserRepository userRepository;

    @PostMapping("/{songId}")
    public ResponseEntity<ApiResponse<Void>> likeSong(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long songId) {
        likeService.likeSong(getUserId(userDetails), songId);
        return ResponseEntity.ok(ApiResponse.success("Song liked", null));
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<ApiResponse<Void>> unlikeSong(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long songId) {
        likeService.unlikeSong(getUserId(userDetails), songId);
        return ResponseEntity.ok(ApiResponse.success("Song unliked", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SongResponse>>> getLikedSongs(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            ApiResponse.success("Liked songs", likeService.getLikedSongs(getUserId(userDetails))));
    }

    @GetMapping("/{songId}/status")
    public ResponseEntity<ApiResponse<Boolean>> isLiked(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long songId) {
        return ResponseEntity.ok(
            ApiResponse.success("Like status", likeService.isLiked(getUserId(userDetails), songId)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}