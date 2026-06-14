package com.nextune.backend.controller;

import com.nextune.backend.dto.*;
import com.nextune.backend.repository.UserRepository;
import com.nextune.backend.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;
    private final UserRepository userRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PlaylistResponse>> createPlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "true") boolean isPublic,
            @RequestParam(required = false) MultipartFile coverImage) {

        Long userId = getUserId(userDetails);
        PlaylistResponse response = playlistService.createPlaylist(
            userId, name, description, isPublic, coverImage);
        return ResponseEntity.ok(ApiResponse.success("Playlist created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaylistResponse>> getPlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = userDetails != null ? getUserId(userDetails) : null;
        return ResponseEntity.ok(
            ApiResponse.success("Playlist found", playlistService.getPlaylistById(id, userId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PlaylistResponse>>> getMyPlaylists(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            ApiResponse.success("Your playlists",
                playlistService.getUserPlaylists(getUserId(userDetails))));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<PlaylistResponse>>> getPublicPlaylists() {
        return ResponseEntity.ok(
            ApiResponse.success("Public playlists", playlistService.getPublicPlaylists()));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PlaylistResponse>> updatePlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean isPublic,
            @RequestParam(required = false) MultipartFile coverImage) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Playlist updated",
            playlistService.updatePlaylist(id, userId, name, description, isPublic, coverImage)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        playlistService.deletePlaylist(id, getUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.success("Playlist deleted", null));
    }

    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<ApiResponse<PlaylistResponse>> addSong(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @PathVariable Long songId) {
        return ResponseEntity.ok(ApiResponse.success("Song added to playlist",
            playlistService.addSong(id, getUserId(userDetails), songId)));
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<ApiResponse<PlaylistResponse>> removeSong(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @PathVariable Long songId) {
        return ResponseEntity.ok(ApiResponse.success("Song removed from playlist",
            playlistService.removeSong(id, getUserId(userDetails), songId)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}