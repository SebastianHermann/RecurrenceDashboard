import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import football from '../../../static/football.jpg';
import { Grid } from '@mui/material';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ maxWidth: 650 }}
      style={{
        padding: '48px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        top: '7%',
        minWidth: '350px',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            variant="h5"
            style={{ fontWeight: '500' }}
            component="div"
          >
            Welcome to the Recurrence Dashboard
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '24px' }}>
            Recurrence Analysis is a new form of performance diagnostics in
            professional football.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            style={{ marginBottom: '48px' }}
          >
            The dashboard allows access to this method without any use of
            programming code. Create individual tactical groups and experience
            its dynamics during the game using configurable recurrence plots (
            <b>RP</b>). In addition, seven recurrence parameters are available
            to quantify these dynamics (<b>RQA</b>).
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            // style={{ marginBottom: '24px' }}
          >
            For more information visit:
          </Typography>
          <Link
            href="https://www.frontiersin.org/articles/10.3389/fpsyg.2021.747058/full"
            underline="hover"
            target={'blank'}
          >
            {'Football Match Dynamics Explored by Recurrence Analysis'}
          </Link>
          <Typography
            variant="body1"
            color="text.secondary"
            style={{ fontSize: '12px' }}
          >
            Lames, M., Hermann, S., Prüßner, R., & Meth, H. (2021). Football
            Match Dynamics Explored by Recurrence Analysis. Frontiers in
            Psychology, 4125.
          </Typography>
        </Grid>
        <CardActions>
          <Button size="large" onClick={() => navigate('/projects')}>
            Explore
          </Button>
          <Button size="large" disabled>
            Start Test
          </Button>
        </CardActions>
      </Grid>
    </Card>
  );
}
