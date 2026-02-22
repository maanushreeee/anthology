import NavBar from '../components/NavBar';
import Grid from '../components/Grid';
import Footer from '../components/Footer';
import { Box, Button, Paper, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();
  
  return(
    <Box>
      <NavBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--color-secondary)', marginTop: 1, marginX: 2, borderRadius: 4 }}>
        <Box sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 4, fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: '"Cardo", serif' }}>
            Welcome to Anthology
          </Typography>
          <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontFamily: '"Cardo", serif', marginTop: 2, fontWeight: 400, fontStyle: 'italic' }}>
            A quiet place to think, write, and publish.
          </Typography>
          <Typography variant='body2' sx={{ color: 'var(--color-bg-default)', fontFamily: '"Cardo", serif', marginTop: 5 }}>
            Write without distraction.
            Save as you go.
            Publish when you’re ready — or later.
          </Typography>
          <Button variant="contained" sx={{ marginTop: 4, backgroundColor: 'var(--color-primary)', fontFamily: '"Cardo", serif', borderRadius: 20, paddingX: 4, paddingY: 1.5 }}>
            Get Started
          </Button>
        </Box>
      </Box>

      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--color-primary)',
            fontFamily: '"Cardo", serif',
            textAlign: 'center',
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          About Us
        </Typography>

        {/* TWO-COLUMN CONTENT */}
        <Box
          sx={{
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* LEFT TEXT */}
          <Box sx={{ maxWidth: 500 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-bg-default)',
                fontFamily: '"Cardo", serif',
                backgroundColor: 'var(--color-primary)',
                padding: 5,
                borderRadius: 5,
                textAlign: 'justify',
                height: 120,
              }}
            >
              Anthology is a platform dedicated to providing a serene and focused environment for writers of all kinds. 
              Whether you're jotting down ideas, drafting stories, or publishing your work, 
              Anthology offers the tools you need to bring your creativity to life without distractions.
            </Typography>
          </Box>

          {/* RIGHT TEXT */}
          <Box sx={{ maxWidth: 500 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-bg-default)',
                fontFamily: '"Cardo", serif',
                backgroundColor: 'var(--color-primary)',
                padding: 5,
                borderRadius: 5,
                textAlign: 'justify',
                height: 120,
              }}
            >
              Most tools rush you.
              They ask you to share before you’ve finished thinking.

              Anthology waits.

              It’s designed around how writing actually happens — slowly, privately, and in layers.
              You begin with uncertainty, move through drafts, and arrive at clarity in your own time.
            </Typography>
          </Box>
        </Box>
    </Box>
    <Box sx={{ padding: { xs: 2, md: 6 }, maxWidth: '1400px', margin: '0 auto' }}>
  {/* Section title */}
  <Typography
    variant="h4"
    sx={{ 
      mb: 6, 
      fontWeight: 700, 
      fontFamily: '"Cardo", serif', 
      textAlign: 'center', 
      color: 'var(--color-primary)' 
    }}
  >
    How it works
  </Typography>

  {/* Steps Container */}
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
    gap: 4 
  }}>
    
    {/* Step 1 */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      padding: 4,
      color: 'var(--color-primary)',
      backgroundColor: 'var(--color-secondary)', 
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Cardo", serif', fontWeight: 700, color: 'var(--color-primary)' }}>
        1. Capture ideas
      </Typography>
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          mb: 3,
          fontFamily: '"Cardo", serif',
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        Not everything starts fully formed. Save fragments, lines, questions,
        and half-sentences — without committing them to anything yet.
        Ideas remain separate from articles, so they can stay loose,
        unfinished, and free.
      </Typography>
      <Button variant="outlined" 
              sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              onClick={() => navigate('/ideas')}>
        Add an idea
      </Button>
    </Box>

    {/* Step 2 */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      padding: 4,
      color: 'var(--color-bg-default)',
      backgroundColor: 'var(--color-primary)', 
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Cardo", serif', fontWeight: 700, color: 'var(--color-secondary)' }}>
        2. Write in drafts
      </Typography>
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          mb: 3,
          fontFamily: '"Cardo", serif',
          color: 'var(--color-secondary)',
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        Turn ideas into drafts when you're ready. Your work is saved quietly
        in the background as you write — no buttons to click, no moments
        interrupted. You can step away and return later, exactly where you
        left off.
      </Typography>
      <Button 
          variant="outlined" 
          sx={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
          onClick={() => navigate('/articles')}>
        Start a draft
      </Button>
    </Box>

    {/* Step 3 */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      padding: 4,
      color: 'var(--color-primary)',
      backgroundColor: 'var(--color-secondary)', 
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Cardo", serif', fontWeight: 700, color: 'var(--color-primary)' }}>
        3. Complete & publish
      </Typography>
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          mb: 3,
          fontFamily: '"Cardo", serif',
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        Completion is a decision, not a deadline. When an article feels
        complete, mark it so. Publish immediately — or schedule it for a time
        that feels right. Until then, your writing stays private.
      </Typography>
      <Button variant="outlined" sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
        Publish when ready
      </Button>
    </Box>
  </Box>
</Box>
<Footer />
    
  </Box>
  );
}