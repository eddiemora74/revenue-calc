import Link from "next/link";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">Revenue Calculator</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#revenuePages"
          aria-controls="revenuePages"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="revenuePages">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link href="/loan">
                <a
                  className={
                    router.pathname === "/loan" ? "nav-link active" : "nav-link"
                  }
                >
                  Loan Payoff Calc
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
