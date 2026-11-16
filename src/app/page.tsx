"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "text" | "image";

type Creation = {
  id: string;
  prompt: string;
  duration: string;
  quality: string;
  model: string;
  ratio: string;
  date: string;
  image: string | null;
  favorite: boolean;
};

const STORAGE_KEY = "nexora-creations";

export default function Home() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [duration, setDuration] = useState("5 seconds");
  const [ratio, setRatio] = useState("16:9");
  const [model, setModel] = useState("NEXORA Realistic");
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState("");
  const [activeNav, setActiveNav] = useState("Create");
  const [history, setHistory] = useState<Creation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      console.error("Could not load saved creations.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, loaded]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }

  function handleImage(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notify("Image must be smaller than 10 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setFileName(file.name);
    };

    reader.readAsDataURL(file);
  }

  function generate() {
    if (!prompt.trim()) {
      notify("Please enter a video prompt first.");
      return;
    }

    if (mode === "image" && !image) {
      notify("Please upload a starting image.");
      return;
    }

    const creation: Creation = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      duration,
      quality,
      model,
      ratio,
      date: new Date().toLocaleString(),
      image,
      favorite: false,
    };

    setGenerating(true);

    window.setTimeout(() => {
      setHistory((old) => [creation, ...old]);
      setGenerating(false);
      notify("Demo request saved! Connect an AI API for real video generation.");
    }, 900);
  }

  function deleteCreation(id: string) {
    setHistory((old) => old.filter((item) => item.id !== id));
    notify("Creation deleted.");
  }

  function toggleFavorite(id: string) {
    setHistory((old) =>
      old.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }

  const visibleHistory =
    activeNav === "Favorites"
      ? history.filter((item) => item.favorite)
      : history;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-symbol">N</span>
          <span className="brand-name">
            NEXORA<span>AI</span>
          </span>
        </a>

        <div className="workspace">
          <span className="workspace-icon">✦</span>
          <div>
            <strong>Personal Workspace</strong>
            <small>Free Plan</small>
          </div>
          <span className="workspace-arrow">⌄</span>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav className="side-nav">
          {[
            ["Create", "✧"],
            ["My Creations", "▧"],
            ["Explore", "◈"],
            ["Favorites", "♡"],
          ].map(([name, icon]) => (
            <button
              key={name}
              className={activeNav === name ? "nav-item active" : "nav-item"}
              onClick={() => setActiveNav(name)}
            >
              <span>{icon}</span>
              {name}
              {name === "My Creations" && <small>{history.length}</small>}
            </button>
          ))}
        </nav>

        <div className="side-label tools-label">TOOLS</div>

        <nav className="side-nav">
          <button
            className="nav-item"
            onClick={() => {
              setMode("text");
              setActiveNav("Create");
            }}
          >
            <span>▤</span> Text to Video
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setMode("image");
              setActiveNav("Create");
            }}
          >
            <span>▧</span> Image to Video
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-star">✦</div>
            <strong>Unlock your creativity</strong>
            <p>Explore more possibilities with NEXORA AI.</p>
            <button onClick={() => notify("Plans will be available soon.")}>
              Explore Plans ↗
            </button>
          </div>

          <button className="profile">
            <span className="avatar">A</span>
            <span>
              <strong>My Account</strong>
              <small>Free member</small>
            </span>
            <span className="profile-dots">•••</span>
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>

          <div className="top-actions">
            <span className="credits">
              <span>✦</span> Free Credits
            </span>
            <button
              className="icon-button"
              title="Notifications"
              onClick={() => notify("You're all caught up.")}
            >
              ♧
            </button>
            <span className="top-avatar">A</span>
          </div>
        </header>

        <div className="content">
          {activeNav === "Create" ? (
            <>
              <section className="welcome">
                <div>
                  <div className="eyebrow">
                    <span className="live-dot"></span>
                    YOUR CREATIVE STUDIO
                  </div>
                  <h1>
                    Create beyond <span>reality.</span>
                  </h1>
                  <p>
                    Turn your imagination into stunning videos with the power
                    of AI.
                  </p>
                </div>

                <div className="welcome-art">
                  <div className="art-orbit orbit-one"></div>
                  <div className="art-orbit orbit-two"></div>
                  <div className="art-core">N</div>
                  <span className="art-star star-one">✦</span>
                  <span className="art-star star-two">✧</span>
                </div>
              </section>

              <div className="studio-grid">
                <section className="generator-card">
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">AI VIDEO STUDIO</span>
                      <h2>Create a video</h2>
                    </div>
                    <span className="beta-badge">BETA</span>
                  </div>

                  <div className="mode-tabs">
                    <button
                      className={
                        mode === "text" ? "mode-tab selected" : "mode-tab"
                      }
                      onClick={() => setMode("text")}
                    >
                      <span>✎</span> Text to Video
                    </button>

                    <button
                      className={
                        mode === "image" ? "mode-tab selected" : "mode-tab"
                      }
                      onClick={() => setMode("image")}
                    >
                      <span>▧</span> Image to Video
                    </button>
                  </div>

                  {mode === "image" && (
                    <div
                      className="upload-area"
                      onClick={() => fileRef.current?.click()}
                    >
                      {image ? (
                        <div className="uploaded-preview">
                          <img src={image} alt="Uploaded preview" />
                          <div>
                            <strong>{fileName}</strong>
                            <small>Click to change image</small>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImage(null);
                                setFileName("");
                              }}
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="upload-icon">⇧</div>
                          <strong>Drop your image here</strong>
                          <span>
                            or <b>browse files</b>
                          </span>
                          <small>PNG, JPG or WEBP · Max 10 MB</small>
                        </>
                      )}

                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={(e) =>
                          handleImage(e.target.files?.[0])
                        }
                      />
                    </div>
                  )}

                  <div className="field-heading">
                    <label htmlFor="prompt">Describe your vision</label>
                    <span>✦ AI PROMPT</span>
                  </div>

                  <div className="prompt-wrap">
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      maxLength={1000}
                      placeholder="Describe the video you imagine... Be creative! For example: A cinematic aerial shot of a futuristic city at sunset, glowing neon lights, flying vehicles, ultra realistic..."
                    />

                    <div className="prompt-footer">
                      <span>✧ Be descriptive for better results</span>
                      <span>{prompt.length}/1000</span>
                    </div>
                  </div>

                  <div className="settings-title">
                    <span>VIDEO SETTINGS</span>
                    <span className="settings-line"></span>
                  </div>

                  <div className="settings-grid">
                    <div className="setting">
                      <label>AI MODEL</label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      >
                        <option>NEXORA Realistic</option>
                        <option>NEXORA Cinematic</option>
                        <option>NEXORA Anime</option>
                        <option>NEXORA Creative</option>
                      </select>
                    </div>

                    <div className="setting">
                      <label>QUALITY</label>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                      >
                        <option>720p</option>
                        <option>1080p</option>
                        <option>4K</option>
                      </select>
                    </div>

                    <div className="setting">
                      <label>DURATION</label>
                      <select
                        value={duration}
                        onChange={(e) =>
                          setDuration(e.currentTarget.value)
                        }
                      >
                        <option value="5 seconds">5 seconds</option>
                        <option value="10 seconds">10 seconds</option>
                        <option value="15 seconds">15 seconds</option>
                        <option value="30 seconds">30 seconds</option>
                        <option value="1 minute">1 minute</option>
                        <option value="2 minutes">2 minutes</option>
                        <option value="3 minutes">3 minutes</option>
                        <option value="4 minutes">4 minutes</option>
                        <option value="5 minutes">5 minutes</option>
                      </select>
                    </div>

                    <div className="setting">
                      <label>ASPECT RATIO</label>
                      <select
                        value={ratio}
                        onChange={(e) => setRatio(e.target.value)}
                      >
                        <option>16:9</option>
                        <option>9:16</option>
                        <option>1:1</option>
                        <option>4:5</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="generate-button"
                    onClick={generate}
                    disabled={generating}
                  >
                    <span>✦</span>
                    {generating ? "Processing..." : "Generate Video"}
                    <span className="button-arrow">→</span>
                  </button>

                  <div className="generate-note">
                    <span>◈</span> Demo mode · Real AI generation API not
                    connected yet
                  </div>
                </section>

                <aside className="preview-column">
                  <div className="preview-card">
                    <div className="preview-heading">
                      <div>
                        <span className="section-kicker">LIVE PREVIEW</span>
                        <h3>Your canvas</h3>
                      </div>
                      <span className="preview-status">
                        <i></i> READY
                      </span>
                    </div>

                    <div
                      className={
                        "video-canvas " +
                        (ratio === "9:16"
                          ? "portrait"
                          : ratio === "1:1"
                            ? "square"
                            : "")
                      }
                    >
                      {image ? (
                        <img
                          className="canvas-image"
                          src={image}
                          alt="Canvas"
                        />
                      ) : (
                        <div className="canvas-art">
                          <div className="canvas-glow"></div>
                          <div className="canvas-ring ring-a"></div>
                          <div className="canvas-ring ring-b"></div>
                          <div className="canvas-planet"></div>
                          <span className="canvas-spark spark-a">✦</span>
                          <span className="canvas-spark spark-b">✧</span>
                        </div>
                      )}

                      <span className="canvas-label">{ratio}</span>
                      <div className="canvas-center-icon">▶</div>
                    </div>

                    <div className="preview-info">
                      <div>
                        <span>MODEL</span>
                        <strong>{model}</strong>
                      </div>
                      <div>
                        <span>QUALITY</span>
                        <strong>{quality}</strong>
                      </div>
                      <div>
                        <span>DURATION</span>
                        <strong>{duration}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="tip-card">
                    <div className="tip-icon">✧</div>
                    <div>
                      <strong>Pro tip</strong>
                      <p>
                        Describe camera movement, lighting, mood and visual
                        details to get more cinematic results.
                      </p>
                    </div>
                  </div>

                  <div className="quick-card">
                    <span className="section-kicker">QUICK IDEAS</span>

                    {[
                      "A dreamy ocean under the stars",
                      "A futuristic neon city at night",
                      "A cinematic mountain sunrise",
                    ].map((idea) => (
                      <button
                        key={idea}
                        onClick={() => setPrompt(idea)}
                      >
                        <span>✦</span>
                        {idea}
                        <b>↗</b>
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <section className="recent-section">
              <div className="recent-heading">
                <div>
                  <span className="section-kicker">YOUR WORKSPACE</span>
                  <h2>
                    {activeNav === "Favorites"
                      ? "Favorite creations"
                      : activeNav}
                  </h2>
                </div>
                <button onClick={() => setActiveNav("Create")}>
                  + Create new
                </button>
              </div>

              {activeNav === "Explore" ? (
                <div className="empty-history">
                  <span>✦</span>
                  <div>
                    <strong>Explore NEXORA AI</strong>
                    <p>Discover new creative tools and features soon.</p>
                  </div>
                </div>
              ) : visibleHistory.length === 0 ? (
                <div className="empty-history">
                  <span>▧</span>
                  <div>
                    <strong>No creations yet</strong>
                    <p>
                      Your saved video requests will appear here when you
                      create.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="history-list">
                  {visibleHistory.map((item) => (
                    <div className="history-item" key={item.id}>
                      <span className="history-icon">✦</span>

                      <div>
                        <strong>{item.prompt}</strong>
                        <small>
                          {item.date} · {item.duration} · {item.quality} ·
                          Demo request
                        </small>
                      </div>

                      <button
                        onClick={() => toggleFavorite(item.id)}
                        title="Favorite"
                      >
                        {item.favorite ? "♥" : "♡"}
                      </button>

                      <button
                        onClick={() => deleteCreation(item.id)}
                        title="Delete"
                      >
                        ×
                      </button>

                      <span className="history-tag">DRAFT</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeNav === "Create" && (
            <section className="recent-section">
              <div className="recent-heading">
                <div>
                  <span className="section-kicker">YOUR WORKSPACE</span>
                  <h2>Recent creations</h2>
                </div>
                <button onClick={() => setActiveNav("My Creations")}>
                  View all →
                </button>
              </div>

              {history.length === 0 ? (
                <div className="empty-history">
                  <span>▧</span>
                  <div>
                    <strong>Your creative journey starts here</strong>
                    <p>
                      Your saved video requests will appear here when you
                      start creating.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="history-list">
                  {history.slice(0, 4).map((item) => (
                    <div className="history-item" key={item.id}>
                      <span className="history-icon">✦</span>
                      <div>
                        <strong>{item.prompt}</strong>
                        <small>
                          {item.duration} · {item.quality} · Demo request
                        </small>
                      </div>
                      <span className="history-tag">DRAFT</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <footer className="footer">
            <span>© 2026 NEXORA AI</span>
            <span>
              CREATE BEYOND REALITY <b>✦</b>
            </span>
            <span>Built for imagination.</span>
          </footer>
        </div>
      </section>

      {toast && (
        <div className="toast">
          <span>✦</span>
          {toast}
          <button onClick={() => setToast("")}>×</button>
        </div>
      )}
    </main>
  );
}