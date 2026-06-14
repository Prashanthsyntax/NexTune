package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryResponse {
    private Long id;
    private SongResponse song;
    private LocalDateTime playedAt;
}