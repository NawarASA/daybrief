import { REPO_URL } from "../constants";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>MIT licensed</span>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={`${REPO_URL}/blob/main/SETUP.md`} target="_blank" rel="noreferrer">
          Setup guide
        </a>
      </div>
    </footer>
  );
}
