package com.nextune.backend.service;

import com.nextune.backend.dto.*;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final PlaylistRepository playlistRepository;
    private final SongService songService;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public UserResponse toggleUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        return mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return mapToResponse(userRepository.save(user));
    }

    public List<SongResponse> getPendingSongs() {
        return songRepository.findByStatusAndActiveTrue(Song.SongStatus.PENDING)
                .stream().map(songService::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalListeners(userRepository.countByRole(Role.LISTENER))
                .totalArtists(userRepository.countByRole(Role.ARTIST))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .premiumUsers(userRepository.countByPremiumTrue())
                .totalSongs(songRepository.count())
                .pendingSongs(songRepository.countByStatus(Song.SongStatus.PENDING))
                .approvedSongs(songRepository.countByStatus(Song.SongStatus.APPROVED))
                .rejectedSongs(songRepository.countByStatus(Song.SongStatus.REJECTED))
                .totalAlbums(albumRepository.count())
                .totalPlaylists(playlistRepository.count())
                .totalPlays(songRepository.getTotalPlays())
                .build();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .premium(user.isPremium())
                .active(user.isActive())
                .emailVerified(user.isEmailVerified())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}