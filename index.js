class CriticalResourceLoader {
  constructor() {
    this.resources = [];
    this.loadPromises = [];
  }

  init() {
    this.resources = [...document.querySelectorAll('[data-critical]')];

    const promises = [
      ...this.resources.map(resource => this.loadResource(resource))
    ];
    return Promise.all(promises);
  }

  loadResource(resource) {
    switch (resource.tagName.toLowerCase()) {
      case 'img':
        return this.loadImage(resource);
      case 'video':
        return this.loadVideo(resource);
      default:
        return Promise.resolve();
    }
  }

  loadImage(img) {
    return new Promise((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = reject;
      }
    });
  }

  loadVideo(video) {
    return new Promise((resolve, reject) => {
      if (video.readyState >= 4) {
        resolve();
      } else {
        video.oncanplaythrough = () => resolve();
        video.onerror = reject;
      }
    });
  }
}

document.body.style.overflow = 'hidden';

const loader = new CriticalResourceLoader();
const preloader = document.querySelector('.preloader');

loader.init()
  .then(() => {
    console.log('All resources loaded');
    preloader.classList.add('hidden');
    document.body.style.overflow = 'visible';
  })
  .catch(error => {
    console.error('Failed to load critical resources:', error);
  })
  .finally(() => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.remove();
    }, 1000);
    document.body.style.overflow = 'visible';
  });