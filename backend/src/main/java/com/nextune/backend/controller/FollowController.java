package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.repository.UserRepository;
import com.nextune.backend.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserRepository userRepository;

    @PostMapping("/{artistId}")
    public ResponseEntity<ApiResponse<Void>> followArtist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long artistId) {
        followService.followArtist(getUserId(userDetails), artistId);
        return ResponseEntity.ok(ApiResponse.success("Artist followed", null));
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<ApiResponse<Void>> unfollowArtist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long artistId) {
        followService.unfollowArtist(getUserId(userDetails), artistId);
        return ResponseEntity.ok(ApiResponse.success("Artist unfollowed", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtistResponse>>> getFollowedArtists(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            ApiResponse.success("Followed artists",
                followService.getFollowedArtists(getUserId(userDetails))));
    }

    @GetMapping("/{artistId}/status")
    public ResponseEntity<ApiResponse<Boolean>> isFollowing(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
            ApiResponse.success("Follow status",
                followService.isFollowing(getUserId(userDetails), artistId)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}