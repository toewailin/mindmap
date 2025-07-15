import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { markmapTransformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';

const initValue = `
# Project Planning Mind Map

## 1. Project Overview
- **Purpose**: Define goals and problem
- **Scope**: Boundaries of the project

## 2. Stakeholders
- **Team**: Developers, Designers, Managers
- **Clients**: Internal and External clients

## 3. Timeline
1. **Start Date**: Project kickoff
2. **Milestones**:
   - Alpha release
   - Beta testing
   - Final delivery

## 4. Budget
- **Costs**: Development, Marketing
- **Revenue**: Expected income, Profit margins

## 5. Resources
- **Human**: Full-time employees, Contractors
- **Tech**: Software tools, Hardware

## 6. Risks
- **Technical Risks**: Bugs, Integration issues
- **Market Risks**: Competitor actions, Shifts in the market

---

## Markdown Syntax Demo

### Bold and Italic
**Bold Text** and *Italic Text*

### Ordered List
1. Task 1
2. Task 2

### Unordered List
- Item 1
- Item 2

### Code Block
\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`
`;

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    // Register custom buttons
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Alert',
      onClick: () => alert('You made it!'),
    });
    toolbar.setItems([...Toolbar.defaultItems, 'alert']);
    wrapper.append(toolbar.render());
  }
}

function App() {
  const [value, setValue] = useState(initValue);
  const refSvg = useRef<SVGSVGElement | null>(null); // Use null for initialization
  const refMm = useRef<Markmap | null>(null); // Use null for initialization
  const refToolbar = useRef<HTMLDivElement | null>(null); // Use null for initialization

  useEffect(() => {
    if (refMm.current) return;
    const mm = Markmap.create(refSvg.current!); // Non-null assertion because refSvg is guaranteed to be set
    refMm.current = mm;
    renderToolbar(mm, refToolbar.current!); // Non-null assertion because refToolbar is guaranteed to be set
  }, [refSvg.current]);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = markmapTransformer.transform(value);
    mm.setData(root).then(() => {
      mm.fit();
    });
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="flex flex-col h-screen p-2">
    <div className="flex h-full p-4">
      {/* Left Side: Input (Markdown) */}
      <div className="flex-1 mr-4">
        <textarea
          className="w-full h-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={handleChange}
          placeholder="Enter your Markdown here..."
        />
      </div>

      {/* Right Side: Rendered Mind Map */}
      <div className="flex-1">
        <svg className="w-full h-full" ref={refSvg} />
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
    </div>
    </div>
  );
}

export default App;
