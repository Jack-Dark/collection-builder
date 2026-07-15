import type { ZoomableThumbnailPropsDef } from './ZoomableThumbnail.types';

import { Dialog } from '../Dialog';
import { useDialog } from '../Dialog/hooks/useDialog';
import { Image } from '../Image';

export const ZoomableThumbnail = (props: ZoomableThumbnailPropsDef) => {
  const { alt, image, thumbnail } = props;

  const [showDialog, hideDialog] = useDialog(() => {
    return (
      <Dialog Header={alt} onClose={hideDialog}>
        <Image {...image} alt={alt} />
      </Dialog>
    );
  }, [image]);

  return <Image {...thumbnail} alt={alt} onClick={showDialog} />;
};
