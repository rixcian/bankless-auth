import app from "./app";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server is listening on http://localhost:${PORT}`);
  /* eslint-enable no-console */
});
