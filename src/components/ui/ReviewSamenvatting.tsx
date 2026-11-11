import { StarRating } from "@/components/ui/StarRating";
import { formatteerPeildatum, reviewWeergave } from "@/lib/reviews";

interface ReviewSamenvattingProps {
  rating: number;
  aantal: number;
}

/**
 * Stars, score and count. Renders nothing while reviewWeergave.zichtbaar is false.
 * When visible, always shows the configured source and census date.
 */
export function ReviewSamenvatting({ rating, aantal }: ReviewSamenvattingProps) {
  if (!reviewWeergave.zichtbaar) return null;

  const bronregel = `Bron: ${reviewWeergave.bron}, peildatum: ${formatteerPeildatum(reviewWeergave.peildatum)}`;

  if (!(rating > 0)) {
    return (
      <span className="text-sm text-gray-500">
        Nog geen reviews. {bronregel}
      </span>
    );
  }

  const label = aantal === 1 ? "review" : "reviews";

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <StarRating rating={rating} />
      <span className="text-sm font-medium text-gray-700">
        {Number(rating).toFixed(1)}
      </span>
      <span className="text-sm text-gray-500">
        ({aantal} {label})
      </span>
      <span className="text-xs text-gray-500">{bronregel}</span>
    </div>
  );
}
