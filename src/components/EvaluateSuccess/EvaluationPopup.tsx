import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  LinearProgress,
  IconButton,
  Box,
  Stack,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { EvaluationResponse } from '../../services/evaluateSuccess-service';
import "../../styles/EvaluationPopup.css";

interface Props {
  open: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResponse | null;
  evaluationLoading: boolean;
  darkMode: boolean;
}

interface ParsedEvaluation {
  successRate: string;
  reason: string;
  demographics: string;
  competition: string;
  location: string;
}

const cleanUpSentence = (text: string) =>
  text.replace(/\s*\d+\.*$/, '').trim();

const formatCleanText = (text: string): ParsedEvaluation => {
  const sentences = text.split(/(?<=\.)\s+/);
  let demographics = '';
  let competition = '';
  let location = '';
  let successRate = 'N/A';
  let reason = '';

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();

    if (lower.includes('success rate') && successRate === 'N/A') {
      const match = sentence.match(/(\d{1,3})%/);
      if (match) successRate = match[1];
    }

    if (lower.includes('- reason:') && !reason) {
      const match = sentence.match(/- Reason:\s*(.+)/i);
      if (match) reason = cleanUpSentence(match[1]);
    } else if (lower.includes('demographic') && !demographics) {
      const match = sentence.match(/- Demographics:\s*(.+)/i);
      demographics = match ? cleanUpSentence(match[1]) : cleanUpSentence(sentence);
    } else if (lower.includes('competition') && !competition) {
      const match = sentence.match(/- Competition:\s*(.+)/i);
      competition = match ? cleanUpSentence(match[1]) : cleanUpSentence(sentence);
    } else if (lower.includes('location') && !location) {
      const match = sentence.match(/- Location:\s*(.+)/i);
      location = match ? cleanUpSentence(match[1]) : cleanUpSentence(sentence);
    }
  }

  return {
    successRate,
    reason: reason || 'No reasoning provided.',
    demographics: demographics || 'No demographic insight available.',
    competition: competition || 'No competition insight available.',
    location: location || 'No location insight available.',
  };
};

const EvaluationPopup: React.FC<Props> = ({
  open,
  onClose,
  evaluationResult,
  evaluationLoading,
  darkMode
}) => {
  const parsed = evaluationResult ? formatCleanText(evaluationResult.cleanText) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={darkMode ? "dark-mode" : ""}
    >
      <DialogTitle
        className={`popup-title ${darkMode ? "dark-mode-title" : ""}`}
      >
        Business Success Evaluation
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={`popup-close-btn ${darkMode ? "dark-mode-close-btn" : ""}`}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        className={`popup-content ${darkMode ? "dark-mode-content" : ""}`}
      >
        {evaluationLoading ? (
          <Box className="popup-loading">
            <LinearProgress className="popup-progress" />
            <Typography variant="body2">Loading...</Typography>
          </Box>
        ) : parsed ? (
          <Stack spacing={3}>
            <Box className="popup-success-rate" display="flex" alignItems="center" gap={1}>
              <BarChartIcon className={`popup-icon ${darkMode ? "dark-mode-icon" : ""}`} />
              <Typography variant="h6" className="popup-rate-text">
                Success Rate:{' '}
                <Box component="span" className="popup-rate-value">
                  {parsed.successRate}%
                </Box>
              </Typography>
            </Box>

            <Typography variant="body2" className="popup-reason">
              <strong>Reason:</strong> {parsed.reason}
            </Typography>

            <Paper
              elevation={1}
              className={`popup-section ${darkMode ? "dark-mode-section" : ""}`}
            >
              <Box className="popup-section-header">
                <PeopleIcon className={`popup-icon ${darkMode ? "dark-mode-icon" : ""}`} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Demographics
                </Typography>
              </Box>
              <Typography variant="body2">{parsed.demographics}</Typography>
            </Paper>

            <Paper
              elevation={1}
              className={`popup-section ${darkMode ? "dark-mode-section" : ""}`}
            >
              <Box className="popup-section-header">
                <StorefrontIcon className={`popup-icon ${darkMode ? "dark-mode-icon" : ""}`} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Competition
                </Typography>
              </Box>
              <Typography variant="body2">{parsed.competition}</Typography>
            </Paper>

            <Paper
              elevation={1}
              className={`popup-section ${darkMode ? "dark-mode-section" : ""}`}
            >
              <Box className="popup-section-header">
                <LocationOnIcon className={`popup-icon ${darkMode ? "dark-mode-icon" : ""}`} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Location
                </Typography>
              </Box>
              <Typography variant="body2">{parsed.location}</Typography>
            </Paper>
          </Stack>
        ) : (
          <Typography align="center" sx={{ mt: 3 }}>
            No result available
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationPopup;