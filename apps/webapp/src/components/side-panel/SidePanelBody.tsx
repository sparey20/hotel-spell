import styles from './SidePanel.module.scss';

type SidePanelBodyProps = {
    children: string | JSX.Element | JSX.Element[]
}

export default function SidePanelBody({children}: SidePanelBodyProps) {
    return (<div className={styles.body}>{children}</div>)
}