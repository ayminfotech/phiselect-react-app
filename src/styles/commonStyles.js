const commonStyles = {
    cardContainer: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6,
      },
      borderRadius: 2,
      boxShadow: 1,
      backgroundColor: '#fff',
    },
    headerText: {
      fontWeight: '600',
      fontSize: '1.2rem',
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: '1rem',
      mb: 1,
    },
    bodyText: {
      color: 'text.secondary',
      fontSize: '0.9rem',
    },
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
      borderRadius: 2,
    },
  };
  
  export default commonStyles;