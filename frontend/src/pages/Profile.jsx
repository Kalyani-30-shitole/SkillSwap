import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      if (!token) {
        console.log("❌ Token not found in localStorage");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE STATUS:", response.status);
      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (response.ok) {
        const userData = data.user || data;
        console.log("USER DATA:", userData);

        setProfile(userData);

        setName(userData.name || "");
        setEmail(userData.email || "");
        setAbout(userData.about || "");
        setTeachSkills(userData.teachSkills || []);
        setLearnSkills(userData.learnSkills || []);

        const savedPhoto = localStorage.getItem("profilePhoto");
        if (savedPhoto) {
          setProfilePhoto(savedPhoto);
        }
      } else {
        console.log("❌ PROFILE ERROR:", data.message);
      }

    } catch (error) {
      console.log("❌ FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;
      setProfilePhoto(imageData);

      localStorage.setItem(
        "profilePhoto",
        imageData
      );
    };
    reader.readAsDataURL(file);
  }
  
    const handleDeletePhoto = () => {
  setProfilePhoto("");
  localStorage.removeItem("profilePhoto");
};

  const addTeachSkill = () => {

    const skill = newTeachSkill.trim();

    if (!skill) {
      return;
    }
    if (!teachSkills.includes(skill)) {
      setTeachSkills([
        ...teachSkills,
        skill,
      ]);
    }

    setNewTeachSkill("");
  };


  const addLearnSkill = () => {
    const skill = newLearnSkill.trim();

    if (!skill) {
      return;
    }
    if (!learnSkills.includes(skill)) {
      setLearnSkills([
        ...learnSkills,
        skill,
      ]);
    }

    setNewLearnSkill("");
  };

  const removeTeachSkill = (skill) => {

    setTeachSkills(
      teachSkills.filter(
        (item) => item !== skill
      )
    );
  };

  const removeLearnSkill = (skill) => {

    setLearnSkills(
      learnSkills.filter(
        (item) => item !== skill
      )
    );
  };

  const handleSave = async () => {

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            about,
            teachSkills,
            learnSkills,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "UPDATE PROFILE RESPONSE:",
        data
      );

      if (response.ok) {

        const updatedUser =
          data.user || data;

        setProfile(updatedUser);

        setName(updatedUser.name || "");
        setEmail(updatedUser.email || "");
        setAbout(updatedUser.about || "");
        setTeachSkills(updatedUser.teachSkills || []);
        setLearnSkills(updatedUser.learnSkills || []);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setEditing(false);

        alert(
          "Profile updated successfully"
        );

      } else {
        alert(
          data.message ||
          "Unable to update profile"
        );
      }

    } catch (error) {
      console.log(error);
      alert("Server error");

    } finally {
      setSaving(false);
    }
  };

  if (loading) {

    return (
      <main className="profile-page">

        <div className="profile-loading">
          Loading profile...
        </div>

      </main>
    );
  }
  if (!profile) {

    return (
      <main className="profile-page">

        <div className="profile-error">

          <h3>Unable to load profile</h3>
          <p>
            Please check whether the backend
            server is running and you are logged in.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="profile-page">

      <section className="profile-header">
        <div className="profile-avatar-container">

          <label
            htmlFor="profile-photo"
            className="profile-avatar">

            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="profile-photo"/>
            ) : (
              name
                ? name.charAt(0).toUpperCase()
                : "U"
            )}

          </label>

          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />

          {profilePhoto && (
  <button
    type="button"
    className="delete-photo-button"
    onClick={handleDeletePhoto}
  >
    Delete Photo
  </button>
)}

        </div>

        <div className="profile-info">
          <p className="profile-label">
            MY PROFILE
          </p>

          {editing ? (

            <input
              className="profile-name-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          ) : (
            <h1>{name}</h1>
          )}
          <p>{email}</p>

        </div>

        <button
          className="edit-profile-button"
          onClick={() =>
            setEditing(!editing)
          }>

          {editing
            ? "Cancel"
            : "Edit Profile"}
        </button>

      </section>

      <section className="skills-container">

        <div className="skill-card">

          <div className="skill-card-header">
            <p className="skill-label">
              I CAN TEACH
            </p>
            <h2>Skills I know</h2>
          </div>

          <div className="skill-list">

            {teachSkills.length > 0 ? (

              teachSkills.map(
                (skill, index) => (

                  <div
                    className="skill-tag teach-tag"
                    key={index}>

                    <span>
                      {skill}
                    </span>

                    {editing && (

                      <button
                        type="button"
                        onClick={() =>
                          removeTeachSkill(skill)
                        }>
                        ×
                      </button>
                    )}

                  </div>
                )
              )

            ) : (
              <p className="empty-skills">
                No teaching skills added yet.
              </p>
            )}

          </div>

          {editing ? (

            <div className="add-skill">

              <input
                type="text"
                placeholder="Add a skill..."
                value={newTeachSkill}
                onChange={(e) =>
                  setNewTeachSkill(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    addTeachSkill();
                  }

                }}
              />

              <button
                type="button"
                onClick={addTeachSkill}>
                Add
              </button>

            </div>
          ) : (
            <button
              type="button"
              className="add-edit-skill-button"
              onClick={() => setEditing(true)}>
              <span>+</span>Add Skills
            </button>

          )}

        </div>

        <div className="skill-card">

          <div className="skill-card-header">
            <p className="skill-label">
              I WANT TO LEARN
            </p>
            <h2>Skills I want to learn</h2>
          </div>

          <div className="skill-list">

            {learnSkills.length > 0 ? (
              learnSkills.map(
                (skill, index) => (

                  <div
                    className="skill-tag learn-tag"
                    key={index} >

                    <span>
                      {skill}
                    </span>

                    {editing && (

                      <button
                        type="button"
                        onClick={() =>
                          removeLearnSkill(skill)
                        }>
                        ×
                      </button>

                    )}
                  </div>

                )
              )

            ) : (
              <p className="empty-skills">
                No learning skills added yet.
              </p>
            )}

          </div>

          {editing ? (

            <div className="add-skill">

              <input
                type="text"
                placeholder="Add a skill..."
                value={newLearnSkill}
                onChange={(e) =>
                  setNewLearnSkill(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    addLearnSkill();
                  }

                }}
              />

              <button
                type="button"
                onClick={addLearnSkill}>
                Add
              </button>

            </div>
          ) : (
            <button
              type="button"
              className="add-edit-skill-button"
              onClick={() => setEditing(true)}>
              <span>+</span>Add Skills
            </button>
          )}

        </div>
      </section>

      <section className="profile-about-section">
        <div className="about-header">
          <div>
            <p className="skill-label">ABOUT ME</p>
            <h2>About Me</h2>
          </div>

          {!editing && (
            <button className="about-edit-button" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <textarea
            className="about-input"
            placeholder="Tell others a little about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="4"
            maxLength="300"/>
        ) : (
          <p className="about-text">
            {about || "No information added yet."}
          </p>
        )}

        {editing && (
          <p className="character-count">
            {about.length}/300
          </p>
        )}
      </section>

      {editing && (

        <div className="profile-save">

          <button
            className="save-profile-button"
            onClick={handleSave}
            disabled={saving}>

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      )}

    </main>
  );
}

export default Profile;