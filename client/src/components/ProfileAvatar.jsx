import React from "react";

const getProfileIcon = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";

  return (
    parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
  ).toUpperCase();
};

const ProfileAvatar = ({
  name,
  size = 40, // px
  bg = "bg-blue-100",
  textColor = "text-white",
  onClick,
}) => {
  const initials = getProfileIcon(name);

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center z-10 justify-center
        rounded-full font-semibold
        cursor-pointer select-none
        ${bg} ${textColor}
      `}
      style={{ width: size, height: size }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default ProfileAvatar;
