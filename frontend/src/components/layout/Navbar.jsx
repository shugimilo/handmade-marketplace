export default function Navbar() {
    const items = ['Logo', 'Shop', 'Categories', 'About', 'Contact', 'Search bar', 'Cart', 'Profile']
    return (
        <nav className="navbar">
        <div className="logo">rukotvorine</div>

        <div className="nav-links">
            <a href="/shop">Prodavnica</a>
            <a href="/categories">Kategorije</a>
            <a href="/about">O nama</a>
            <a href="/contact">Kontakt</a>
        </div>

        <div className="nav-actions">
            Pretraga Korpa Profil
        </div>
        </nav>
    )
}