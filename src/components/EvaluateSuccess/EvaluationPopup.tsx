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

interface Props {
  open: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResponse | null;
  evaluationLoading: boolean;
}

interface ParsedEvaluation {
  successRate: string;
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

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();

    if (lower.includes('success rate') && successRate === 'N/A') {
      const match = sentence.match(/(\d{1,3})%/);
      if (match) successRate = match[1];
    }

    if (lower.includes('demographic') && !demographics) {
      demographics = cleanUpSentence(sentence);
    } else if (lower.includes('competition') && !competition) {
      competition = cleanUpSentence(sentence);
    } else if (lower.includes('location') && !location) {
      location = cleanUpSentence(sentence);
    }
  }

  return {
    successRate,
    demographics: demographics || 'No demographic insight available.',
    competition: competition || 'No competition insight available.',
    location: location || 'No location insight available.',
  };
};

const EvaluationPopup: React.FC<Props> = ({
  open,
  onClose,
  evaluationResult,
  evaluationLoading
}) => {
  const parsed = evaluationResult ? formatCleanText(evaluationResult.cleanText) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Business Success Evaluation
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {evaluationLoading ? (
          <LinearProgress />
        ) : parsed ? (
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <BarChartIcon color="primary" />
              <Typography variant="h6">
                Success Rate:{' '}
                <Box component="span" fontWeight="bold" color="primary.main">
                  {parsed.successRate}%
                </Box>
              </Typography>
            </Box>

            <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PeopleIcon color="action" />
                <Typography variant="subtitle1" fontWeight="bold">Demographics</Typography>
              </Box>
              <Typography variant="body2">{parsed.demographics}</Typography>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <StorefrontIcon color="action" />
                <Typography variant="subtitle1" fontWeight="bold">Competition</Typography>
              </Box>
              <Typography variant="body2">{parsed.competition}</Typography>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationOnIcon color="action" />
                <Typography variant="subtitle1" fontWeight="bold">Location</Typography>
              </Box>
              <Typography variant="body2">{parsed.location}</Typography>
            </Paper>
          </Stack>
        ) : (
          <Typography align="center">No result available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationPopup;
