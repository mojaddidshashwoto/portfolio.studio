import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { SUBJECTS, SUBJECT_SLUGS, getPhotosBySubject } from "@/lib/photos";
import SubjectGalleryClient from "@/components/SubjectGalleryClient";

interface SubjectPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export async function generateStaticParams() {
  return SUBJECT_SLUGS.map((slug) => ({
    subject: slug,
  }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = SUBJECTS[slug];
  if (!subject) return {};

  const title = `${subject.title} Photography — Mojaddid Shashwoto`;
  const description = `${subject.plainDescription} Photography by Mojaddid Shashwoto.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://mojaddid.studio/gallery/${subject.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://mojaddid.studio/gallery/${subject.slug}`,
      siteName: "Mojaddid Shashwoto Portfolio",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: slug } = await params;
  const subject = SUBJECTS[slug];

  if (!subject) {
    notFound();
  }

  const subjectPhotos = getPhotosBySubject(slug);
  const allSubjects = Object.values(SUBJECTS);

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mojaddid.studio",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Archive",
        "item": "https://mojaddid.studio/gallery",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": subject.title,
        "item": `https://mojaddid.studio/gallery/${subject.slug}`,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#0a0a0a]">
      <Script
        id={`breadcrumb-${subject.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Link
              href="/"
              className="text-neutral-400 hover:text-[#c6ff3d] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6ff3d]"
              data-cursor="hover"
            >
              Home
            </Link>
            <span className="text-neutral-600">/</span>
            <Link
              href="/gallery"
              className="text-neutral-400 hover:text-[#c6ff3d] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6ff3d]"
              data-cursor="hover"
            >
              Archive
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-[#c6ff3d] uppercase tracking-wider">
              {subject.title}
            </span>
          </div>

          <span className="font-mono text-[11px] tracking-widest text-[#c6ff3d] uppercase px-2 py-0.5 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
            Subject Series
          </span>
        </div>

        {/* Editorial Heading & Single Plain Description */}
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase text-[#f2f2f2]">
            {subject.title}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl font-sans mt-3">
            {subject.plainDescription}
          </p>
        </div>

        {/* Client Gallery Grid & Lightbox */}
        <SubjectGalleryClient
          subject={subject}
          photos={subjectPhotos}
          allSubjects={allSubjects}
        />
      </div>
    </div>
  );
}
