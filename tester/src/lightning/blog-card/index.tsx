import { createEffect, createSignal, Show, type Component } from 'solid-js';
import styles from './.module.css';
import { ProfileSectionMutable, EntireProfile, Comment } from './ProfileMutable';
import { formatNumber } from './utils/formatNumber';
import { profiles } from './data';
// import { ThemeToggle } from './theme_toggler';



function Profile({profile}: {profile: ProfileSectionMutable}) {
  const [editing_name, setEditingName] = createSignal(profile.name);
  createEffect(() => {
    console.log("editing_name", editing_name());
  });
  return (
    <div class={styles.profileContainer}>
      <img class={styles.profileImage} width={30} height={30} src={profile.image} alt={profile.name} />
      <h4 contentEditable={true} onInput={(e) => setEditingName((e.target as HTMLInputElement).innerText)} class={styles.profileName}>{profile.name}</h4>
      <Show when={editing_name() !== profile.name}>
        <button onClick={() => {
          profile.name = editing_name();
        }}>Save</button>
      </Show>
      <span>{" * "}</span>
      <p>{profile.last_active}</p>
    </div>
  );
}

function Message({comment}: {comment: Comment}) {
  return (
    <div class={styles.message}>
      <div class={styles.messageProfile}>
        <img 
          class={styles.messageImage} 
          src={comment.posted_by.image} 
          alt={comment.posted_by.name} 
        />
        <p class={styles.messageName}>{comment.posted_by.name}</p>
      </div>
      <p class={styles.messageContent}>{comment.content}</p>
    </div>
  );
}

function Comments({comments}: {comments: Comment[]}) {
  return (
    <div>
      <div class={styles.commentsHeader}>
        <h3 class={styles.commentsTitle}>Comments ({comments.length})</h3>
      </div>
      <div style={{"max-height": "200px", overflow: "scroll"}} class={styles.messages}>
        {comments.map((comment) => (
          <Message comment={comment} />
        ))}
      </div>
    </div>
  );
}

function ActionButtons({likes, comments, messages, setShowingComments}: {likes: number, comments: number, messages: number, setShowingComments: (value: boolean) => void}) {
  return (
    <div class={styles.actionButtons}>
      <div class={styles.group}>
        <button 
          class={styles.actionButton} 
          title="Like"
          onClick={() => likes++}
        >
          👍 {formatNumber(likes)}
        </button>
        <button class={styles.actionButton} title="Dislike">👎</button>
      </div>

      <div class={styles.group}>
        <button
          class={styles.actionButton} 
          title="Comment"
        >
          💬 {formatNumber(comments)} Comments
        </button>
        <button class={styles.actionButton} title="Message">
          💬 {formatNumber(messages)} Messages
        </button>
      </div>

      <button class={styles.actionButton} title="More options">⋯</button>
    </div>
  );
}

export default function Card({ children, profile}: {children?: any, profile: EntireProfile}) {
  const [editing_content, setEditingContent] = createSignal(profile.content);
  const [showingComments, setShowingComments] = createSignal(false);
  
  createEffect(() => {
    console.log("editing_content", editing_content());
  });

  return (
    <div onclick={() => setShowingComments((prev: boolean) => !prev)}
     class={styles.cardContainer}>
      <Profile profile={profile} />
      <div class={styles.cardContent}>
        <div>
          <p 
            contentEditable={true} 
            onInput={(e) => setEditingContent((e.target as HTMLElement).innerText)}
          >
            {profile.content}
          </p>
          <Show when={editing_content() !== profile.content}>
            <button onClick={() => {
              profile.content = editing_content();
            }}>Save</button>
          </Show>
        </div>
        <img class={styles.cardImage} width={160} height={160} src={profile.image} alt="image" />
      </div>
      <ActionButtons 
        setShowingComments={setShowingComments} 
        likes={profile.likes} 
        comments={profile.comments.length} 
        messages={profile.messages} 
      />
      <Show when={showingComments()}>
        <Comments comments={profile.comments} />
      </Show>
      {children}
    </div>
  );
}





// const intersectionObserver = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add(styles.appear);
//     }
//   });
// });

// (document.querySelectorAll(`.${styles.cardContainer}`) as NodeListOf<HTMLElement>).forEach((card) => {
//   intersectionObserver.observe(card);
// });
