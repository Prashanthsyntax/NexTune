package com.nextune.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalListeners;
    private long totalArtists;
    private long totalAdmins;
    private long premiumUsers;
    private long totalSongs;
    private long pendingSongs;
    private long approvedSongs;
    private long rejectedSongs;
    private long totalAlbums;
    private long totalPlaylists;
    private long totalPlays;
}