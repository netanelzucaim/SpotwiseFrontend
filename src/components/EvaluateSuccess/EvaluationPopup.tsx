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
            <Typography variant="body2" gutterBottom>
              {evaluationResult.cleanText}
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