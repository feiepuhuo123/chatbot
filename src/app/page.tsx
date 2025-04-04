import ChatInterface from './components/ChatInterface';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>聊天机器人</h1>
        <ChatInterface />
      </main>
    </div>
  );
}
