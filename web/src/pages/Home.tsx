import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router';
import logo from '../assets/pencil/logo.png';
import illustration from '../assets/pencil/home-background.png';
import './Home.css';

export default function Home() {
  return (
    <div id="page-home">
      <img className="hero-illustration" src={illustration} alt="" aria-hidden="true" />
      <div className="content">
        <header><img src={logo} alt="Ecoleta" width="182" height="44" /></header>
        <main>
          <h1>Seu marketplace<br className="desktop-break" /> de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos<br className="desktop-break" /> de coleta de forma eficiente.</p>
          <Link to="/create-point">
            <span><FiLogIn aria-hidden="true" /></span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
}
