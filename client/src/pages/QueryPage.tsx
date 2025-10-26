import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Code as CodeIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const API_URL = 'http://localhost:5000';

interface QueryResponse {
  success: boolean;
  question: string;
  sparql: string;
  results: any[];
  count: number;
  error?: string;
}

function QueryPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string>('');

  const exampleQuestions = [
    "Quels sont tous les utilisateurs?",
    "Quelles sont les allergies de Khalil?",
    "Quel est le poids de Dhia?",
    "Quels aliments contiennent des protéines?",
    "Quels utilisateurs ont un objectif de perte de poids?",
    "Quelles activités physiques pratique moetaz?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Veuillez entrer une question');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const result = await axios.post(`${API_URL}/query`, { question });
      setResponse(result.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleQ: string) => {
    setQuestion(exampleQ);
    setError('');
    setResponse(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white'
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            🤖 AI Nutrition Query System
          </Typography>
          <Typography variant="subtitle1">
            Ask questions in natural language about nutrition and health
          </Typography>
        </Paper>

        {/* Search Box */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Quels sont les utilisateurs végétariens?"
                disabled={loading}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  minWidth: 150
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </form>

          {/* Example Questions */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              💡 Example Questions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleQuestions.map((ex, idx) => (
                <Chip
                  key={idx}
                  label={ex}
                  onClick={() => handleExampleClick(ex)}
                  disabled={loading}
                  sx={{
                    flex: '1 1 calc(33% - 8px)',
                    minWidth: 150,
                    justifyContent: 'flex-start',
                    '&:hover': { bgcolor: '#e3f2fd' }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {response && (
          <Box>
            {/* SPARQL Query */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CodeIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Generated SPARQL Query
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  color: '#4ec9b0',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  borderRadius: 2
                }}
              >
                <pre style={{ margin: 0 }}>{response.sparql}</pre>
              </Paper>
            </Paper>

            {/* Results Table */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon color="success" />
                  <Typography variant="h6" fontWeight="bold">
                    Results ({response.count})
                  </Typography>
                </Box>
                {response.count > 0 && (
                  <Chip
                    label={`${response.count} result${response.count > 1 ? 's' : ''} found`}
                    color="success"
                    size="small"
                  />
                )}
              </Box>

              {response.results.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No results found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        {Object.keys(response.results[0]).map((key) => (
                          <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                            {key.toUpperCase()}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {response.results.map((row, idx) => (
                        <TableRow
                          key={idx}
                          sx={{ '&:hover': { bgcolor: '#f9fafb' } }}
                        >
                          {Object.values(row).map((val: any, vidx) => (
                            <TableCell key={vidx}>
                              {val || <span style={{ color: '#999' }}>-</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default QueryPage;
