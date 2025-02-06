// style imports
import styles from '../styles/SideMenu.module.css';

// component imports
import { HiOutlineMenu } from "react-icons/hi";
import logo from '../../public/logo.svg'

const SideMenu = ({ menu, toggleMenu, handleLogout, tags, toggleActiveTag, toggleNewNote, activeTag }) => {

    return (
        <div>
            {menu ? <div onClick={toggleMenu} className={`overlay ${styles.overlay}`}></div> : ''}
            <div className={`${styles.container} ${menu ? styles.menu_open : ''}`}>
                <div className={styles.top_container}>
                    <h1 className={styles.title}>Expresso<br />Notes</h1>
                    <img className={styles.logo} src={logo} alt="" />
                    <button className='btn_icon' onClick={toggleMenu}>
                        <HiOutlineMenu />
                    </button>
                </div>

                <button onClick={toggleNewNote} className={`${styles.btn_newnote}`}>+ New Note</button>

                <h2 style={{width: '100%'}}>Tags</h2>
                <div style={{width: "100%"}}>
                    <button onClick={() => toggleActiveTag(null)} className={`${styles.btn_tag} ${!activeTag ? styles.btn_tag_active : ''}`}>All Notes</button>
                    {tags.map((tag, index) => 
                    <button onClick={() => toggleActiveTag(tag)} className={`${styles.btn_tag} ${activeTag === tag ? styles.btn_tag_active : ''}`} key={index}>{tag}</button>
                    )}
                </div>

                <button onClick={handleLogout} className={`${styles.btn_logout} btn_large`}>Logout</button>
            </div>
        </div>
    );
}

export default SideMenu;