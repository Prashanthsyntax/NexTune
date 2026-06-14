package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.nextune.backend.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;
    private final UserRepository userRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ArtistResponse>> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String artistName,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profileImage,
            @RequestParam(required = false) MultipartFile coverImage) {

        Long userId = getUserId(userDetails);
        ArtistResponse response = artistService.createArtistProfile(
            userId, artistName, bio, profileImage, coverImage);
        return ResponseEntity.ok(ApiResponse.success("Artist profile created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtistResponse>> getArtist(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Artist found", artistService.getArtistById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtistResponse>>> getAllArtists() {
        return ResponseEntity.ok(
            ApiResponse.success("Artists fetched", artistService.getAllArtists()));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ArtistResponse>> updateArtist(
            @PathVariable Long id,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profileImage,
            @RequestParam(required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(ApiResponse.success("Artist updated",
            artistService.updateArtist(id, bio, profileImage, coverImage)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}