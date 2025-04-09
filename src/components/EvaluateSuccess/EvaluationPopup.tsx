import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  LinearProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EvaluationResponse } from '../../services/evaluateSuccess-service';

interface Props {
  open: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResponse | null;
  evaluationLoading: boolean;
}

const EvaluationPopup: React.FC<Props> = ({
  open,
  onClose,
  evaluationResult,
  evaluationLoading
}) => {
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
      <DialogContent>
        {evaluationLoading ? (
          <LinearProgress />
        ) : evaluationResult ? (
          <>
            <Typography variant="h6" align="center">
              Success Rate:
            </Typography>
            <Typography
              variant="h4"
              align="center"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              {evaluationResult.successRate}%
            </Typography>

            <Typography variant="subtitle1">Demographics:</Typography>
            <Typography variant="body2" gutterBottom>
              {evaluationResult.demographicsExplanation}
            </Typography>

            <Typography variant="subtitle1">Competition:</Typography>
            <Typography variant="body2" gutterBottom>
              {evaluationResult.competitionExplanation}
            </Typography>

            <Typography variant="subtitle1">Location:</Typography>
            <Typography variant="body2">
              {evaluationResult.locationExplanation}
            </Typography>
          </>
        ) : (
          <Typography align="center">No result available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationPopup;