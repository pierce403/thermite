// --- Mobile Navigation Menu ---
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}


// --- Spark Background Animation (HTML5 Canvas) ---
const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = (canvas.width = window.innerWidth);
  height = (canvas.height = window.innerHeight);
});

class Spark {
  constructor(x, y, isExplosion = false) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * (isExplosion ? 3.5 : 2) + 0.5;
    
    // Upward drift velocity with slight sideways sway
    this.vx = (Math.random() - 0.5) * (isExplosion ? 6 : 1);
    this.vy = isExplosion 
      ? (Math.random() - 0.8) * 8 - 2 
      : -Math.random() * 1.5 - 0.5;
    
    this.alpha = 1;
    this.decay = Math.random() * (isExplosion ? 0.03 : 0.008) + 0.002;
    
    // Thermite colors: Red, Orange, Amber, Gold
    const colors = [
      'rgba(255, 85, 0, ',
      'rgba(255, 120, 0, ',
      'rgba(255, 170, 0, ',
      'rgba(255, 210, 0, ',
      'rgba(255, 60, 60, '
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    
    // Add minor turbulence
    if (Math.random() > 0.8) {
      this.vx += (Math.random() - 0.5) * 0.3;
    }
  }

  draw() {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowBlur = this.size * 2;
    ctx.shadowColor = this.colorBase.replace(', ', ')');
    ctx.fillStyle = `${this.colorBase}${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let sparks = [];

// Spawn ambient sparks from the bottom of the screen
function spawnAmbientSparks() {
  if (sparks.length < 100 && Math.random() > 0.6) {
    // Concentrate spawns slightly more towards the center
    const x = Math.random() * width;
    sparks.push(new Spark(x, height + 10));
  }
}

// Generate explosion
function triggerSparkBurst(x, y, count = 40) {
  for (let i = 0; i < count; i++) {
    sparks.push(new Spark(x, y, true));
  }
}

// Click to generate sparks
window.addEventListener('click', (e) => {
  // Avoid triggers if clicking buttons or input to prevent UX annoyance
  if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && e.target.tagName !== 'INPUT') {
    triggerSparkBurst(e.clientX, e.clientY, 15);
  }
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  spawnAmbientSparks();
  
  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.update();
    spark.draw();
    
    if (spark.alpha <= 0 || spark.x < 0 || spark.x > width || spark.y < 0) {
      sparks.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animate);
}

animate();


// --- Interactive Mock Terminal ---
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');

// History tracking
let commandHistory = [];
let historyIndex = -1;

const commands = {
  help: 'Display available commands in the Thermite shell.',
  about: 'Learn what ThermiteOS is.',
  kernel: 'View information about the Redox microkernel core.',
  sysinfo: 'Display mock system specification diagnostics.',
  research: 'Trigger the autoresearch code synthesis daemon.',
  spark: 'Release a dynamic burst of thermite sparks.',
  clear: 'Clear the terminal terminal logs.',
  reboot: 'Reboot the virtual OS environment.'
};

function writeLine(text, cssClass = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${cssClass}`;
  line.innerHTML = text;
  
  // Insert before the input row
  const inputRow = terminalBody.querySelector('.terminal-input-row');
  terminalBody.insertBefore(line, inputRow);
  
  // Scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function handleCommand(cmdStr) {
  const trimmed = cmdStr.trim();
  if (trimmed === '') return;
  
  // Save history
  commandHistory.push(trimmed);
  historyIndex = commandHistory.length;
  
  writeLine(`<span class="prompt">thermite#</span> ${cmdStr}`);
  
  const args = trimmed.split(' ');
  const primaryCmd = args[0].toLowerCase();
  
  if (primaryCmd === 'help') {
    writeLine('Available commands:');
    for (const [name, desc] of Object.entries(commands)) {
      writeLine(`  <span class="highlight-orange">${name.padEnd(12)}</span> - ${desc}`);
    }
  } else if (primaryCmd === 'about') {
    writeLine('<strong>ThermiteOS</strong> is an experimental operating system distro.');
    writeLine('It leverages the modular, memory-safe design of the <strong>Redox Microkernel</strong>,');
    writeLine('and implements autonomous developer agents that live in the OS workspace.');
    writeLine('These agents investigate dependencies, fix compilations, and synthesize userland.');
  } else if (primaryCmd === 'kernel') {
    writeLine('Redox Microkernel Core Specification:', 'output-info');
    writeLine('  Language: Rust (100% memory safe, zero-cost abstractions)');
    writeLine('  Architecture: Microkernel (Drivers, filesystems & networks run in User Space)');
    writeLine('  System Calls: Message-passing IPC model based on Redox schemes');
    writeLine('  FS: RedoxFS (Transaction-based filesystem with safe crash recovery)');
  } else if (primaryCmd === 'sysinfo') {
    writeLine('ThermiteOS diagnostic information:', 'output-info');
    writeLine('  OS Target       : Redox-x86_64-thermite');
    writeLine('  Kernel Version  : Redox Kernel 0.9.0-thermite-alpha');
    writeLine('  Shell           : Thermite Ion Shell (v0.1.0)');
    writeLine('  CPU Config      : Simulated 16-Core Agent-Core Processor');
    writeLine('  Uptime          : 3h 42m 15s');
    writeLine('  Autoresearch    : Daemon active; 4 package synthesis operations completed.');
  } else if (primaryCmd === 'spark') {
    writeLine('Igniting thermite canister... sparks dispatched!', 'output-spark');
    // Trigger in the middle of the screen
    triggerSparkBurst(window.innerWidth / 2, window.innerHeight / 2, 75);
  } else if (primaryCmd === 'clear') {
    // Remove all lines except input row
    const lines = terminalBody.querySelectorAll('.terminal-line');
    lines.forEach(l => l.remove());
  } else if (primaryCmd === 'reboot') {
    terminalInput.disabled = true;
    writeLine('Initiating system shutdown...', 'output-warning');
    
    setTimeout(() => {
      writeLine('Stopping Autoresearch daemon...', 'output-warning');
    }, 400);
    
    setTimeout(() => {
      writeLine('Unmounting redoxfs schemas...', 'output-warning');
      const lines = terminalBody.querySelectorAll('.terminal-line');
      lines.forEach(l => l.remove());
    }, 1000);

    setTimeout(() => {
      writeLine('Redox microkernel loading...');
      writeLine('Initializing user-space drivers: ps2, pcspkr, vesa...');
      writeLine('Starting Autoresearch daemon (ard)... <span class="output-success">[OK]</span>');
      writeLine('Launching Thermite Shell... <span class="output-success">[OK]</span>');
      writeLine('System successfully rebooted.', 'output-success');
      terminalInput.disabled = false;
      terminalInput.focus();
    }, 2000);
  } else if (primaryCmd === 'research') {
    const pkg = args[1] || 'libthermite';
    simulateResearchLoop(pkg);
  } else {
    writeLine(`Command not found: "${primaryCmd}". Type <span class="highlight-orange">"help"</span> for options.`, 'output-error');
  }
}

// Autoresearch mock agent loop simulator
function simulateResearchLoop(packageName) {
  terminalInput.disabled = true;
  writeLine(`[ard] Starting autoresearch loop for package '${packageName}'...`, 'output-info');
  
  const steps = [
    { text: `[ard] Fetching dependencies for '${packageName}' from redox-repository...`, delay: 600, class: '' },
    { text: `[ard] Warning: Build failed for '${packageName}' on target 'x86_64-unknown-redox'`, delay: 1300, class: 'output-warning' },
    { text: `[ard] Diagnostics: error[E0425]: cannot find function \`sigaction\` in module \`nix::sys::signal\``, delay: 2000, class: 'output-error' },
    { text: `[ard] Spawned subagent \`researcher-agent-77\` to investigate ABI compatibility...`, delay: 2800, class: 'output-info' },
    { text: `[agent-77] Querying Redox OS documentation for Unix signal wrappers...`, delay: 3800, class: '' },
    { text: `[agent-77] Found recommendation: Redox microkernel uses custom scheme \`event:\` instead of standard POSIX signals.`, delay: 4800, class: 'output-success' },
    { text: `[agent-77] Synthesizing rust file patch: replacing sigaction with Scheme Event handler...`, delay: 5800, class: 'output-info' },
    { text: `[agent-77] Testing code patch compilation locally in isolated sandbox...`, delay: 7000, class: '' },
    { text: `[agent-77] Sandbox compilation SUCCESS. Verified zero regressions.`, delay: 7800, class: 'output-success' },
    { text: `[ard] Applying synthesized patch to '${packageName}' build tree...`, delay: 8400, class: '' },
    { text: `[ard] Re-compiling '${packageName}'...`, delay: 9000, class: '' },
    { text: `[ard] Package '${packageName}' built successfully and signed into distro cache.`, delay: 9800, class: 'output-success' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      writeLine(step.text, step.class);
    }, step.delay);
  });

  // Enable input after all steps
  setTimeout(() => {
    terminalInput.disabled = false;
    terminalInput.focus();
  }, 10200);
}

// Event Listeners for Terminal input
terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = terminalInput.value;
    handleCommand(val);
    terminalInput.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminalInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      terminalInput.value = '';
    }
  }
});

// Click terminal body to focus input
terminalBody.addEventListener('click', (e) => {
  // Only focus if user is not selecting text
  if (window.getSelection().toString() === '') {
    terminalInput.focus();
  }
});
