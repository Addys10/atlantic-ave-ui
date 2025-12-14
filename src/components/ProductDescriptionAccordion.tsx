'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionSection {
  title: string;
  content: string;
}

interface ProductDescriptionAccordionProps {
  htmlContent: string;
}

export default function ProductDescriptionAccordion({ htmlContent }: ProductDescriptionAccordionProps) {
  const [openSections, setOpenSections] = useState<number[]>([0]); // První sekce otevřená defaultně

  // Parsuj HTML a rozdělí ho podle H2 nadpisů
  const parseSections = (html: string): AccordionSection[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections: AccordionSection[] = [];

    const headings = doc.querySelectorAll('h2, h3');

    if (headings.length === 0) {
      // Pokud nejsou žádné nadpisy, vrať celý obsah jako jednu sekci
      return [{ title: 'Popis', content: html }];
    }

    headings.forEach((heading, index) => {
      const title = heading.textContent || '';
      let content = '';
      let nextElement = heading.nextElementSibling;

      // Sbírej všechny elementy až do dalšího nadpisu
      while (nextElement && !nextElement.matches('h2, h3')) {
        content += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }

      sections.push({ title, content });
    });

    return sections;
  };

  const sections = parseSections(htmlContent);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <button
            onClick={() => toggleSection(index)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {section.title}
            </h3>
            <motion.div
              animate={{ rotate: openSections.includes(index) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} className="text-gray-600" />
            </motion.div>
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {openSections.includes(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div
                  className="p-4 text-gray-700 leading-relaxed
                    [&_p]:mb-3 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3
                    [&_li]:mb-1.5
                    [&_strong]:font-semibold
                    [&_em]:italic"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
