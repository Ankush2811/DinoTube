export type Category = {
  slug: string;
  name: string;
  iconUrl: string;
};

export type VideoContent = {
  title: string;
  mediaUrl: string;
  mediaType: "YOUTUBE";
  thumbnailUrl: string;
  slug: string;
};

export type VideoItem = VideoContent & {
  id: string;
  category: Category;
  playbackUrl: string;
  durationSeconds: number;
};

export type CategoryGroup = {
  category: Category;
  contents: VideoContent[];
};

const fallbackMp4s = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

const rawCategories: CategoryGroup[] = [
  {
    category: {
      slug: "social-media-ai",
      name: "Social Media AI",
      iconUrl: "https://media.samajsaathi.com/icons/learn-ai/04-social-media-ai.png",
    },
    contents: [
      {
        title: "AI Motivational Reel Banao Free Mein",
        mediaUrl: "https://youtube.com/embed/_HL7l_62bUc",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b29/TC9Jbr_MBNoEJm5Mwhc2F.png",
        slug: "_HL7l_62bUc",
      },
      {
        title: "Social Media Ke Liye Facts Video Banao",
        mediaUrl: "https://youtube.com/embed/avZd1bSvqyE",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b28/7hy7WSculPFwQtcVu0BzN.png",
        slug: "avZd1bSvqyE",
      },
      {
        title: "Instagram Ka Naya AI Feature",
        mediaUrl: "https://youtube.com/embed/meVTqNn1P5A",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2a/T6DpgH_xrEN15r1f3rqu-.png",
        slug: "meVTqNn1P5A",
      },
      {
        title: "Ab Meta AI Karega Aapki Photo Edit",
        mediaUrl: "https://youtube.com/embed/x3LsfGSP-Hk",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b29/Joql9g8WnlzhXj5sDCfN5.png",
        slug: "x3LsfGSP-Hk",
      },
      {
        title: "AI Se Reel Banaye 1 Minute Mein",
        mediaUrl: "https://youtube.com/embed/lfDxSj9xnmI",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b29/F5qaMZqTNvp4Z9KmprqEV.png",
        slug: "lfDxSj9xnmI",
      },
      {
        title: "Instagram AI Character Kaise Banaye",
        mediaUrl: "https://youtube.com/embed/LX598gRezv4",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b28/r_1g2P1AnedS4SSN89vwG.png",
        slug: "LX598gRezv4",
      },
      {
        title: "Trending 3D AI Photo Kaise Banaye",
        mediaUrl: "https://youtube.com/embed/BDN_N-mAbkU",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b28/rKMuPZJCl1S9wIpP-knMt.png",
        slug: "BDN_N-mAbkU",
      },
      {
        title: "Social Media Content Ke Liye Best AI Tools",
        mediaUrl: "https://youtube.com/embed/ogAG6GcmHjQ",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b29/M-Gw4R2hoRC29el9zQ-uI.png",
        slug: "ogAG6GcmHjQ",
      },
      {
        title: "AI Tools Se Asani Se COntent Creator Bano",
        mediaUrl: "https://youtube.com/embed/mobK-kGDxWo",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b29/9kGHRX9Gj9OcEJwBuVDt1.png",
        slug: "mobK-kGDxWo",
      },
      {
        title: "AI Ki Madad Se Faceless Videos Banao",
        mediaUrl: "https://youtube.com/embed/6ZqxfloJ3Vk",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b28/y9MpZDuI2z1kZV_mNA2Qd.png",
        slug: "6ZqxfloJ3Vk",
      },
    ],
  },
  {
    category: {
      slug: "ai-income",
      name: "AI Income",
      iconUrl: "https://media.samajsaathi.com/icons/learn-ai/05-ai-income.png",
    },
    contents: [
      {
        title: "Yeh Free AI Tool Se Paise Kamao",
        mediaUrl: "https://youtube.com/embed/TpW3QxwADgE",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2e/SK5TdlG5x5Tc-KG29U_Jm.png",
        slug: "TpW3QxwADgE",
      },
      {
        title: "AI Clone Se Paise Kamao",
        mediaUrl: "https://youtube.com/embed/Wi9cKN6Fg1E",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a883ea8/MuPkcktStazw3ImTOJGIm.png",
        slug: "Wi9cKN6Fg1E",
      },
      {
        title: "Pictory AI Se Youtube Side Income Bann Sakta Hai?",
        mediaUrl: "https://youtube.com/embed/mkGhOo_oB4o",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2f/uOV2zrTv8yrsXW3v5nKX2.png",
        slug: "mkGhOo_oB4o",
      },
      {
        title: "DesiVocal Se Bharpur Paise Kamao",
        mediaUrl: "https://youtube.com/embed/k-aVj_Geyvc",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2e/MBiZLEvaN7FdmVqUDZcJR.png",
        slug: "k-aVj_Geyvc",
      },
      {
        title: "AI Se WordPress Plugin Banakar Paise Kamao",
        mediaUrl: "https://youtube.com/embed/gUDRMsW3v1U",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2f/RWn-4G0cCcDogRcsUuZHY.png",
        slug: "gUDRMsW3v1U",
      },
      {
        title: "Quick Money AI Se Kamao",
        mediaUrl: "https://youtube.com/embed/I93GvazYTuc",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2e/owJQOWUFlWuxa7HZuageT.png",
        slug: "I93GvazYTuc",
      },
      {
        title: "AI Hindi Story Se Youtube Pe Paise Kamao",
        mediaUrl: "https://youtube.com/embed/ibI3RRJN0Wg",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a883f60/F8LDntc6q7xMdyJfjC17W.png",
        slug: "ibI3RRJN0Wg",
      },
      {
        title: "Kya Hum AI Se Active Income Bana Sakta Hai?",
        mediaUrl: "https://youtube.com/embed/TPtAAW3LSP4",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2e/B7yW2SjAclyMReSqcYSfM.png",
        slug: "TPtAAW3LSP4",
      },
      {
        title: "Fiverr Par AI Se Paise Kamao",
        mediaUrl: "https://youtube.com/embed/JrbFF30SHzc",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a883ea7/LOY5sDu5YgN2GaPpJXg5J.png",
        slug: "JrbFF30SHzc",
      },
      {
        title: "AI Tool Se Side Business Shuru Karo!",
        mediaUrl: "https://youtube.com/embed/VKpgO2FVXa0",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b2e/GuuKXPXsea-n1IM1VW6jt.png",
        slug: "VKpgO2FVXa0",
      },
    ],
  },
  {
    category: {
      slug: "ai-essentials",
      name: "AI Essentials",
      iconUrl: "https://media.samajsaathi.com/icons/learn-ai/07-ai-essentials.png",
    },
    contents: [
      {
        title: "50 Lakh Ki AI Course Bilkul Free!",
        mediaUrl: "https://youtube.com/embed/DzCWyUCr9LQ",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b39/BhkweJb1D0L7oiuL4XdSo.png",
        slug: "DzCWyUCr9LQ",
      },
      {
        title: "Google Ka AI Course 100% Free",
        mediaUrl: "https://youtube.com/embed/kmHt5BHXYvU",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b3a/3rE_mrJr2af5XMJxEXuV_.png",
        slug: "kmHt5BHXYvU",
      },
      {
        title: "Nvidia Ka Free Generative AI Course",
        mediaUrl: "https://youtube.com/embed/_w07HdQxuIw",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b3a/oD30ARDLlEDQxinlqQvwZ.png",
        slug: "_w07HdQxuIw",
      },
      {
        title: "Data Annotation Projects WFH Ke Liye",
        mediaUrl: "https://youtube.com/embed/ua-NkDcLneo",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b3a/36455BIBrDfyDFwJBbyzh.png",
        slug: "ua-NkDcLneo",
      },
      {
        title: "5 Best Free AI Skills Courses",
        mediaUrl: "https://youtube.com/embed/sAz94JQ6v4w",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b39/U9h2KU6HwQ1BX45INCy0y.png",
        slug: "sAz94JQ6v4w",
      },
      {
        title: "Indian Government Ka AI Course",
        mediaUrl: "https://youtube.com/embed/5kQdqXsmnBc",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b39/zBWHk56rKEmLqmbWXN9N6.png",
        slug: "5kQdqXsmnBc",
      },
      {
        title: "Lakhon Kamao Yeh Course Karke",
        mediaUrl: "https://youtube.com/embed/IoslCQQ4lcE",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b39/ZHWjXBXcErWgNiR2fz2na.png",
        slug: "IoslCQQ4lcE",
      },
      {
        title: "Crowdgen Platform Ka AI Training Jobs",
        mediaUrl: "https://youtube.com/embed/SxtDXU_rM1s?feature=share",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b3a/O9KNgQYUNIXrTjvwZWEmE.png",
        slug: "SxtDXU_rM1s?feature=share",
      },
      {
        title: "EY Aur Microsoft Ka Free AI Course",
        mediaUrl: "https://youtube.com/embed/gcOFJSc-lWs",
        mediaType: "YOUTUBE",
        thumbnailUrl:
          "https://v3b.fal.media/files/b/0a877b3a/o4DNA97xHC1BixuETJS_J.png",
        slug: "gcOFJSc-lWs",
      },
    ],
  },
];

let runningIndex = 0;
export const categoryGroups = rawCategories.map((group) => {
  const contents = group.contents.map((item) => {
    const durationSeconds = 60 + ((runningIndex * 23) % 240);
    const playbackUrl = fallbackMp4s[runningIndex % fallbackMp4s.length];
    const id = `${group.category.slug}-${item.slug}`;
    runningIndex += 1;
    return {
      ...item,
      id,
      category: group.category,
      playbackUrl,
      durationSeconds,
    };
  });
  return { ...group, contents };
});

export const allVideos: VideoItem[] = categoryGroups.flatMap(
  (group) => group.contents,
);
