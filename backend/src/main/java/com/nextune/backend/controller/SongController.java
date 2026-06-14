package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.service.SongService;
import com.nextune.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;
    private final UserRepository userRepository;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<ApiResponse<SongResponse>> uploadSong(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String title,
            @RequestParam(required = false) Long albumId,
            @RequestParam(required = false) Long genreId,
            @RequestParam(defaultValue = "false") boolean premium,
            @RequestParam MultipartFile audioFile,
            @RequestParam(required = false) MultipartFile coverImage) {

        Long userId = getUserId(userDetails);
        SongResponse response = songService.uploadSong(
            userId, title, albumId, genreId, premium, audioFile, coverImage);
        return ResponseEntity.ok(ApiResponse.success("Song uploaded successfully", response));
    }

    @GetMapping("/public/top")
    public ResponseEntity<ApiResponse<List<SongResponse>>> getTopSongs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(
            ApiResponse.success("Top songs", songService.getTopSongs(limit)));
    }

    @GetMapping("/public/latest")
    public ResponseEntity<ApiResponse<List<SongResponse>>> getLatestSongs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(
            ApiResponse.success("Latest songs", songService.getLatestSongs(limit)));
    }

    @GetMapping("/public/search")
    public ResponseEntity<ApiResponse<Page<SongResponse>>> searchSongs(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
            ApiResponse.success("Search results", songService.searchSongs(query, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SongResponse>> getSong(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Song found", songService.getSongById(id)));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<SongResponse>>> getSongsByArtist(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
            ApiResponse.success("Songs by artist", songService.getSongsByArtist(artistId)));
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<ApiResponse<Void>> incrementPlay(@PathVariable Long id) {
        songService.incrementPlayCount(id);
        return ResponseEntity.ok(ApiResponse.success("Play count updated", null));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SongResponse>> approveSong(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Song approved", songService.approveSong(id)));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SongResponse>> rejectSong(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success("Song rejected", songService.rejectSong(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ARTIST','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.ok(ApiResponse.success("Song deleted", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}