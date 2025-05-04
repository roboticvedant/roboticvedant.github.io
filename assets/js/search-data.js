// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/~naikveda/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "My Work.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/~naikveda/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/~naikveda/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/~naikveda/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Vedant K. Naik is a robotics developer, passionate about Autonomous Vehicle and Sustainibility.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/~naikveda/cv/";
          },
        },{id: "projects-autonomous-blimp-robot",
          title: 'Autonomous Blimp Robot',
          description: "Blimp robot modelling and control.",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/1_project/";
            },},{id: "projects-foc-inverter-prototype",
          title: 'FOC Inverter Prototype',
          description: "Field Oriented Control (FOC) motor controller development for solar racing applications",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/2_project/";
            },},{id: "projects-lidar-point-visualizer-processor",
          title: 'LiDAR point visualizer/processor',
          description: "LiDAR based object detection related work.",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/3_project/";
            },},{id: "projects-proprioceptive-soft-robot-sensor-modelling",
          title: 'Proprioceptive Soft Robot Sensor Modelling',
          description: "Compensation of non-linear dynamics of sensor.",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/4_project/";
            },},{id: "projects-vehicle-perception",
          title: 'Vehicle Perception',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/5_project/";
            },},{id: "projects-openai-gym-based-rl-policy-development",
          title: 'OpenAI GYM based RL policy development',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/~naikveda/projects/6_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6E%61%69%6B%76%65%64%61@%6D%73%75.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/roboticvedant# your GitHub user name", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/vedantknaik", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0002-1231-8932# your ORCID ID", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=87iPAZ0AAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
