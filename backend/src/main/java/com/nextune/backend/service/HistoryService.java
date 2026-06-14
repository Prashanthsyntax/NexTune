package com.nextune.backend.service;

import com.nextune.backend.dto.HistoryResponse;
import com.nextune.backend.model.*;
import com.nextune.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final ListeningHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final SongService songService;

    public void recordHistory(Long userId, Long songId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        ListeningHistory history = ListeningHistory.builder()
                .user(user)
                .song(song)
                .build();
        historyRepository.save(history);
    }

    public List<HistoryResponse> getHistory(Long userId, int limit) {
        return historyRepository.findByUserIdOrderByPlayedAtDesc(userId, PageRequest.of(0, limit))
                .stream()
                .map(h -> HistoryResponse.builder()
                        .id(h.getId())
                        .song(songService.mapToResponse(h.getSong()))
                        .playedAt(h.getPlayedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }
}