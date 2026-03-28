import NavItems from './NavItems';
import '../styles/header.css'

const navigation = [
    {name: 'Home', path: '/home'},
        {name: 'View Goals', path: "/view_goals"}
    // format {name: 'test', path: '/test'}
]

export default function Header(props) {
    return (
        //website header
        <>
        <header className="header">
            <nav className='nav'>
                {navigation.map((link) => (
                    <NavItems
                        key={link.path}
                        name={link.name}
                        path={link.path}
                    />
                ))}
            </nav>
        </header>
        </>
    );
}