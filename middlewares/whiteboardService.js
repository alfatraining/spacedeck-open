module.exports = (req, res, next) => {
  const path = req.path.split('/');
  const apiTopLevelPath = path[1];
  const apiSecondaryPath = path[3];
  const presharedKeyFromHeaders = req.headers['x-spacedeck-api-token'];
  const presharedKey = process.env.SPACEDECK_ADMIN_API_TOKEN;
  const presharedKeyMatched = presharedKey === presharedKeyFromHeaders;

  switch (apiTopLevelPath) {
    case 'users':
      if (presharedKeyMatched) {
        return next();
      } else {
        return res.status(401).send('Unauthorized');
      }

    case 'spaces':
      if (presharedKeyMatched) {
        return next();
      } else if (apiSecondaryPath === 'memberships') {
        // memberships
        return res.status(401).send('Unauthorized');
      } else if (
        !apiSecondaryPath &&
        (req.method === 'POST' || req.method === 'DELETE')
      ) {
        // spaces
        return res.status(401).send('Unauthorized');
      } else {
        return next();
      }

    case 'sessions':
      if (presharedKeyMatched) {
        return next();
      } else {
        return res.status(401).send('Unauthorized');
      }

    case 'search':
      if (presharedKeyMatched) {
        return next();
      } else {
        return res.status(401).send('Unauthorized');
      }
    default:
      return next();
  }
};
