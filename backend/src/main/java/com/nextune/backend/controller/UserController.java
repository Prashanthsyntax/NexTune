package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            ApiResponse.success("Profile fetched", userService.getProfile(userDetails.getUsername())));
    }

    @PutMapping(value = "/me", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profileImage) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
            userService.updateProfile(userDetails.getUsername(), username, bio, profileImage)));
    }

    @PutMapping("/me/premium")
    public ResponseEntity<ApiResponse<UserProfileResponse>> upgradeToPremium(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Upgraded to Premium! Enjoy downloads and an ad-free experience.",
            userService.togglePremium(userDetails.getUsername(), true)));
    }

    @PutMapping("/me/premium/cancel")
    public ResponseEntity<ApiResponse<UserProfileResponse>> cancelPremium(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Premium subscription cancelled",
            userService.togglePremium(userDetails.getUsername(), false)));
    }
}