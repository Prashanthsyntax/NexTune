package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.service.AlbumService;
import com.nextune.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;
    private final UserRepository userRepository;

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<ApiResponse<AlbumResponse>> createAlbum(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "ALBUM") String albumType,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate releaseDate,
            @RequestParam(required = false) MultipartFile coverImage) {

        Long userId = getUserId(userDetails);
        AlbumResponse response = albumService.createAlbum(
            userId, title, description, albumType, releaseDate, coverImage);
        return ResponseEntity.ok(ApiResponse.success("Album created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlbumResponse>> getAlbum(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Album found", albumService.getAlbumById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAllAlbums() {
        return ResponseEntity.ok(
            ApiResponse.success("Albums fetched", albumService.getAllAlbums()));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAlbumsByArtist(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
            ApiResponse.success("Artist albums", albumService.getAlbumsByArtist(artistId)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}